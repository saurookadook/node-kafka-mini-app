import type { Knex } from "knex";

// https://knexjs.org/guide/migrations.html#migration-cli
// using CLI
// - https://github.com/knex/knex/issues/4793#issuecomment-1136127506
// - https://github.com/knex/knex/issues/4793#issuecomment-1876258280

const isTest = process.env.NODE_ENV === 'test';

const commonKnexConfig = {
  client: 'pg',
  // connetion: {
  //   host: process.env.PG_HOST,
  //   database: isTest ? process.env.PG_TEST_DATABASE_NAME : process.env.PG_DATABASE_NAME,
  // },
  extension: 'ts',
  migrations: {
    getNewMigrationName: (name: string) => {
      const safeName = (typeof name === 'string' && name != '') || name != null
        ? name
        : 'migration';

      return `${Date.now()}-${safeName}.ts`;
    },
    stub: 'migrationTemplate.ts',
    tableName: "knex_migrations",
  },
};

type KnexMigrationConfig = {
  [key: string]: Knex.Config;
}

const config: KnexMigrationConfig = {
  development: {
    ...commonKnexConfig,
    connection: {
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_MIGRATIONS_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  // staging: {
  //   client: commonConfig.client,
  //   connection: {
  //     database: "my_db",
  //     user: "username",
  //     password: "password",
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: "knex_migrations",
  //   },
  // },

  // production: {
  //   client: commonConfig.client,
  //   connection: {
  //     database: "my_db",
  //     user: "username",
  //     password: "password",
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: "knex_migrations",
  //   },
  // },

};

export default config;
