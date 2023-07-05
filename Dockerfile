# syntax=docker/dockerfile:1

FROM --platform=$TARGETPLATFORM node:20-alpine3.17

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY --link . .

EXPOSE 3000

ENTRYPOINT ["yarn", "start"]