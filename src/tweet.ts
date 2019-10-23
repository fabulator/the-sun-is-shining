import Twitter from 'twitter';
import { DateTime } from 'luxon';

const client = new Twitter({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token_key: process.env.TWITTER_TOKEN,
    access_token_secret: process.env.TWITTER_SECRETTOKEN,
});

export default (text: string) => {
    console.log(`${DateTime.local().toISO()} - ${text}`);
    return client.post('statuses/update', { status: text });
}
