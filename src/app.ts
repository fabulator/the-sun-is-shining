// @ts-ignore
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { CronJob, CronTime, CronCommand } from 'cron';
import { DateTime } from 'luxon';

const LAT = Number(process.env.LAT);
const LON = Number(process.env.LON);

if (!LAT || !LON) {
    throw new Error('Location variables are not set.');
}

type when = 'today' | 'tomorrow';

function setCronJob(time: (lat: number, lon: number, time: Date) => Date, when: when, action: CronCommand): CronJob {
    const job = (new CronJob('', action));

    const t = new Date();
    if (when === 'tomorrow') {
        t.setDate(t.getDate() + 1);
    }

    try {
        job.setTime(new CronTime(time(LAT, LON, t)));
        job.nextDate().toDate();
    } catch(exception) {
        if (exception.message === 'WARNING: Date in past. Will never be fired.') {
            return setCronJob(time, 'tomorrow', action);
        }
        throw exception;
    }

    job.start();

    return job
}

function getPeriodLength(period: 'day' | 'night') {
    const sunFunction = period === 'day' ? getSunset : getSunrise;

    const { hours, minutes } = DateTime.local().diff(DateTime.fromJSDate(sunFunction(LAT, LON, DateTime.local().plus({ days: period === 'day' ? 0 : 1 }).toJSDate()))).negate().shiftTo('hours', 'minutes');

    return { hours, minutes };
}

function setSunsetJob(day: when) {
    return setCronJob(getSunset, day, () => {
        const { hours, minutes } = getPeriodLength('night');
        console.log('statuses/update', { now: DateTime.local(), status: `Dobrou noc, právě zapadlo slunce. Noc potrvá ${hours} hodin a ${Math.floor(minutes)} minut a skončí v ${DateTime.fromJSDate(getSunrise(LAT, LON, DateTime.local().plus({ days: 1 }).toJSDate())).toFormat('HH:mm')}.` });
        setSunsetJob('tomorrow');
    });
}

function setSunriseJob(day: when) {
    return setCronJob(getSunrise, day, () => {
        const { hours, minutes } = getPeriodLength('day');
        console.log('statuses/update', { now: DateTime.local(), status: `Dobré ráno, právě vyšlo slunce. Den potrvá ${hours} hodin a ${Math.floor(minutes)} minut a skončí v ${DateTime.fromJSDate(getSunset(LAT, LON)).toFormat('HH:mm')}.` });
        setSunriseJob('tomorrow');
    });
}

console.log('Starting jobs.');

setSunsetJob('today');
setSunriseJob('today');
