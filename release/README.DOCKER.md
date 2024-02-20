# Bux Console

---

## How to use this image

---

### starting new instance

`docker run -p 3000:3000 ${DOCKER_IMAGE}:${VERSION}`

### override default config

#### Runtime configuration
In order to override the default variables, an additional _env-config.json_ needs to be created in the host filesystem. For example:

```json
{
  "serverUrl": "http://localhost:3003/v1"
}
```

`docker run -p 3000:3000 -v /host/path/to/env-config.json:/usr/share/nginx/html/env-config.json ${DOCKER_IMAGE}:${VERSION}`


#### Server configuration

You can adjust some of the server configuration with the following environment variables:

`SPV_WALLET_ADMIN_PORT` - configure port on which the server should listen on. Default `3000`.

```bash
docker run -p 3000:80 -e SPV_WALLET_ADMIN_PORT=80 ${DOCKER_IMAGE}:${VERSION}
```

`SPV_WALLET_ADMIN_PROXY_API_DOMAIN` - set the protocol and domain of the API, so the proxy can pass the requests to it.

```bash
docker run -p 3000:3000 -e SPV_WALLET_ADMIN_PROXY_API_DOMAIN=https://wallet.my-domain.tld ${DOCKER_IMAGE}:${VERSION}
```
