FROM nginx:1.25-alpine

COPY ./release/nginx.default.conf.template /etc/nginx/templates/default.conf.template

WORKDIR /usr/share/nginx/html
COPY ./build .

ENV SPV_WALLET_ADMIN_PORT=3000
ENV SPV_WALLET_ADMIN_PROXY_API_DOMAIN=http://localhost:3003
