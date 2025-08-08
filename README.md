# `node-kafka-mini-app`

A mini app in Node.js utilizing [KafkaJS](https://kafka.js.org/docs/getting-started).

- _**Coming Soon**: Replicating Topics to tables in PostgreSQL via [Postgres.js](https://github.com/porsager/postgres) (or maybe a different library?)_

![Demo running producers and consumers](./mini-demo.gif)

## Installation

```sh
$ cd app
$ nvm use # if this fails, run `nvm install`
$ corepack enable
$ yarn install
$ cd ..
$ docker compose build all --no-cache
```

## Runnin' the Containers

```sh
$ docker compose up all-kafka -d
# ^ check the logs in the containers to make sure that zookeeper, the brokers, the REST proxy, and the schema registry all started correctly

# TODO: still need to figure out how to add `healthcheck` and startup/retry conditions
#       so that **all** of the containers will start up in the correct dependency order

$ docker dompose up mini-app -d
# ^ check the logs in its container to make sure that the topic schema(s) get registered
```

Then run these in different tabs/windows:

**Tab 1**
```sh
$ docker compose up consumers -d && docker compose logs consumers --follow
```

**Tab 2**
```sh
$ docker compose up producers -d && docker compose logs producers --follow
```

## Running the App

🚧 _WIP_ 🚧

## References

- [Confluent's JavaScript Client for Apache Kafka](https://github.com/confluentinc/confluent-kafka-javascript)
- [Confluent's JavaScript Client for Apache Kafka<sup>TM</sup>](https://github.com/confluentinc/confluent-kafka-javascript)
