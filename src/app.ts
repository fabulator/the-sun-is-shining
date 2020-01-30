import { CronJob, CronTime, CronCommand } from 'cron';
import { DateTime } from 'luxon';
import { getSunrise, getSunset } from './sunrise-sunset';
import post from './tweet';

type When = 'today' | 'tomorrow';

function setCronJob(sunEvent: (time: Date) => Date, when: When, action: CronCommand): CronJob {
    const job = new CronJob(new Date(), action);

    const eventTime = new Date();

    if (when === 'tomorrow') {
        eventTime.setDate(eventTime.getDate() + 1);
    }

    try {
        job.setTime(new CronTime(sunEvent(eventTime)));
        job.nextDate().toDate();
    } catch (exception) {
        if (exception.message === 'WARNING: Date in past. Will never be fired.') {
            return setCronJob(sunEvent, 'tomorrow', action);
        }
        throw exception;
    }

    job.start();

    return job;
}

function getPeriodLength(period: 'day' | 'night') {
    const sunFunction = period === 'day' ? getSunset : getSunrise;

    const eventTime = DateTime.fromJSDate(sunFunction(DateTime.local().plus({ days: period === 'day' ? 0 : 1 }).toJSDate()));

    const { hours, minutes } = DateTime.local().diff(eventTime).negate().shiftTo('hours', 'minutes');

    return {
        hours,
        minutes: Math.floor(minutes),
    };
}

function setSunsetJob(day: When) {
    return setCronJob(getSunset, day, () => {
        const { hours, minutes } = getPeriodLength('night');
        const sunrise = DateTime.fromJSDate(getSunrise(DateTime.local().plus({ days: 1 }).toJSDate()));
        post(`Dobrou noc, právě jsem zapadlo. Noc potrvá ${hours} hodin a ${minutes} minut a skončí v ${sunrise.toFormat('HH:mm')}.`);
        setSunsetJob('tomorrow');
    });
}

function setSunriseJob(day: When) {
    return setCronJob(getSunrise, day, () => {
        const { hours, minutes } = getPeriodLength('day');
        const sunset = DateTime.fromJSDate(getSunset());
        post(`Dobré ráno, právě jsem vyšlo. Den potrvá ${hours} hodin a ${minutes} minut a skončí v ${sunset.toFormat('HH:mm')}.`);
        setSunriseJob('tomorrow');
    });
}

console.log('Starting jobs.');

setSunsetJob('today');
setSunriseJob('today');
