FROM node:22-bullseye AS packages-dev
ENV YARN_VERSION 4.6.0
ENV yarn='corepack yarn'
# EXPOSE 8080 9229
WORKDIR /opt/build
COPY ./app/package.json ./app/yarn.lock ./
COPY ./app/src ./
RUN $yarn install

FROM node:22-bullseye AS mini-app-dev
ENV YARN_VERSION 4.6.0
ENV yarn='corepack yarn'
RUN useradd --uid 2000 miniapp -m
RUN mkdir -p /opt/mini-app/node_modules
RUN chown -R miniapp:miniapp /opt/mini-app/node_modules
USER miniapp
WORKDIR /opt/mini-app
COPY --from=packages-dev /opt/build/node_modules /opt/mini-app/node_modules
ENTRYPOINT [ "yarn", "start:mini-app-dev" ]


# FROM node:22-bullseye AS consumers

# FROM node:22-bullseye AS producers

# FROM node:22-bullseye AS mini-app
