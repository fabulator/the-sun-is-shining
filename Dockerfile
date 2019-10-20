FROM node:12-alpine

WORKDIR /srv

COPY package*.json package-lock.json /srv/

RUN npm ci

COPY tsconfig.json /srv/

COPY src /srv/src/

RUN npm run tsc

RUN rm -rf /srv/src

RUN npm ci --production

CMD npm run start
