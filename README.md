# The Sun is shining

This project will publish message to your Twitter on sunrise and on sunset. To use it just run a docker container:

```shell
docker run -d -e LAT=XX.XXX -e LON=XX.XXX -e TZ=Europe/Prague -e TWITTER_KEY=XXX -e TWITTER_SECRET=XXX -e TWITTER_TOKEN=XXX -e TWITTER_SECRETTOKEN=XXX fabulator/the-sun-is-shining:latest
```
