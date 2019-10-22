FROM node:12-alpine AS build

WORKDIR /srv
COPY package*.json /srv/
RUN npm ci
COPY tsconfig.json /srv/
COPY src /srv/src/
RUN npm run tsc
RUN npm ci --production

FROM alpine:3
RUN apk add --update nodejs --no-cache
RUN rm -rf /var/cache/apk/*
WORKDIR /srv
COPY --from=build /srv/node_modules /srv/node_modules
COPY --from=build /srv/dist /srv/
CMD node index.js
