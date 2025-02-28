import path from 'node:path';
import util from 'node:util';

import dotenv from 'dotenv';
import type { Knex } from "knex";

// TODO: not sure why this import isn't being resolved correctly :']
// import { fullW, halfW } from '@/utils/logger';
const halfW = process.stdout.columns / 2;
const fullW = process.stdout.columns;

const __dirname = path.resolve();

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function logCentered(text: string): void {
  console.log(`    ${text}    `.padStart(halfW, '=').padEnd(fullW, '='));
}

// https://knexjs.org/guide/migrations.html#migration-cli
// using CLI
// - https://github.com/knex/knex/issues/4793#issuecomment-1136127506
// - https://github.com/knex/knex/issues/4793#issuecomment-1876258280

logCentered('process.env');
console.log(util.inspect(process.env, { colors: true, depth: null }), '\n');

const isTest = process.env.NODE_ENV === 'test';

// TODO: trying to use type `Knex.Config` throws errors?
const commonKnexConfig = {
  client: 'pg',
  connection:
  // process.env.PSQL_CONNECTION ||
  {
    database: isTest ? process.env.POSTGRES_DB_TEST : process.env.POSTGRES_DB,
    // host: process.env.POSTGRES_HOST,
    host: 'localhost',
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    // user: process.env.POSTGRES_APP_USER,
    rejectUnauthorized: false,
  },
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

logCentered('commonKnexConfig');
console.log(util.inspect(commonKnexConfig, { colors: true, depth: null }), '\n');

type KnexMigrationConfig = {
  [key: string]: Knex.Config;
}

const config: KnexMigrationConfig = {
  development: {
    ...commonKnexConfig,
    connection: {
      ...commonKnexConfig.connection,
      // database: process.env.POSTGRES_DB,
      // user: process.env.POSTGRES_MIGRATIONS_USER,
      // password: process.env.POSTGRES_PASSWORD,
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

export { commonKnexConfig };
export default config;
