# Bux Console

---

## How to use this image

---

### starting new instance

`docker run -p 127.0.0.1:3000:3000 ${DOCKERHUB_OWNER}/${DOCKERHUB_REPO}:latest`

### override default config

In order to override the default variables, an additional _env-config.json_ needs to be created in the host filesystem. For example:

```json
{
  "serverUrl": "http://localhost:3003/v1"
}
```

`docker run -p 127.0.0.1:3000:3000 -v /host/path/to/env-config.json:/usr/share/nginx/html/env-config.json ${DOCKERHUB_OWNER}/${DOCKERHUB_REPO}:latest`
