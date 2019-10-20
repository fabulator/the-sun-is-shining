FROM node:12-alpine

WORKDIR /srv

COPY package*.json package-lock.json /srv/

RUN npm ci

COPY tsconfig.json /srv/

COPY src /srv/src/

RUN npm run tsc

CMD npm run start
