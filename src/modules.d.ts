declare namespace NodeJS {
    export interface ProcessEnv {
        LAT: string,
        LON: string,
        TWITTER_KEY: string,
        TWITTER_SECRET: string,
        TWITTER_TOKEN: string,
        TWITTER_SECRETTOKEN: string,
    }
}

declare module 'sunrise-sunset-js' {
    export function getSunrise(lat: number, lon: number, day?: Date): Date;
    export function getSunset(lat: number, lon: number, day?: Date): Date;
}
