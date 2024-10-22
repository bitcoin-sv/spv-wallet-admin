FROM node:22-bookworm-slim

RUN npx -y playwright@1.48.1 install --with-deps

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

