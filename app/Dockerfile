FROM node:22-bullseye AS packages-dev
ENV YARN_VERSION 4.6.0
ENV yarn='corepack yarn'
WORKDIR /opt/build
COPY ./app/.yarnrc.yml ./
COPY ./app/customTSNodeLoader.js ./
COPY ./app/nodemon.json ./
COPY ./app/package.json ./
COPY ./app/tsconfig.json ./
COPY ./app/yarn.lock ./
COPY ./app/src ./
RUN $yarn install

FROM node:22-bullseye AS build-dev
ENV YARN_VERSION 4.6.0
ENV yarn='corepack yarn'
RUN useradd --uid 2000 miniapp -m
RUN mkdir -p /opt/mini-app/node_modules
RUN chown -R miniapp:miniapp /opt/mini-app/node_modules
USER miniapp
WORKDIR /opt/mini-app
COPY --from=packages-dev /opt/build/node_modules /opt/mini-app/node_modules

FROM build-dev AS db-migrations-dev
ENTRYPOINT [ "corepack", "yarn", "knex:esm" ]

FROM build-dev AS consumers-dev
EXPOSE 9339
ENTRYPOINT [ "corepack", "yarn", "start:consumers:dev" ]

FROM build-dev AS mini-app-dev
EXPOSE 9337
ENTRYPOINT [ "corepack", "yarn", "start:mini-app:dev" ]

FROM build-dev AS producers-dev
EXPOSE 9338
ENTRYPOINT [ "corepack", "yarn", "start:producers:dev" ]
