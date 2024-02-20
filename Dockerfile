# build stage
FROM node:21 as build

WORKDIR /app

RUN addgroup --system app && adduser --system app --ingroup app && chown -R app:app /app

USER app

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin

# Copy package files to separate yarn install and copying other files
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of project files
COPY . .

ENV NODE_ENV=production

# Build project into build directory
RUN yarn run build

# App final stage
# serving the production build
FROM nginx:1.25.1-alpine

# We need some custom nginx configuration, which we import here
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

# Copy our production build from the first step to nginx's html directory
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build/ .

EXPOSE 3000
