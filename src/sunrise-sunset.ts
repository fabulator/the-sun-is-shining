import { getSunrise as sunrise, getSunset as sunset } from 'sunrise-sunset-js';

const LAT = Number(process.env.LAT);
const LON = Number(process.env.LON);

if (!LAT || !LON) {
    throw new Error('Location variables are not set.');
}

export function getSunrise(date?: Date) {
    return sunrise(LAT, LON, date);
}

export function getSunset(date?: Date) {
    return sunset(LAT, LON, date);
}
