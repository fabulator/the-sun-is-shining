/* eslint-disable @typescript-eslint/camelcase */
import { DateTime } from 'luxon';
import { TwitterApi } from 'twitter-api-v2';

export const client = new TwitterApi({
    appKey: process.env.TWITTER_KEY,
    appSecret: process.env.TWITTER_SECRET,
    accessToken: process.env.TWITTER_TOKEN,
    accessSecret: process.env.TWITTER_SECRETTOKEN,
});

export default async (text: string) => {
    console.log(`${DateTime.local().toISO()} - ${text}`);

    try {
        await client.v2.tweet({ text });
    } catch (exception) {
        console.error(exception);
    }
};
