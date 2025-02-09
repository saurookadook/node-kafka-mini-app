import type { Knex } from "knex";

// https://knexjs.org/guide/migrations.html#migration-cli
// using CLI
// - https://github.com/knex/knex/issues/4793#issuecomment-1136127506
// - https://github.com/knex/knex/issues/4793#issuecomment-1876258280

// yarn knex --knexfile ./db/knexfile.ts

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

// using knex with TS
// - https://github.com/knex/knex/issues/6087
// ---- https://knexjs.org/guide/migrations.html#custom-migration-sources
// ---- https://github.com/ir-engine/ir-engine/commit/f4066e4acdb96960c9676c8300209ed364018575
// ---- https://github.com/ir-engine/ir-engine/blob/f4066e4acdb96960c9676c8300209ed364018575/packages/server-core/knexfile.ts
class MiniAppMigrationSource {
  extension: Knex.MigratorConfig['extension'] = 'ts';
  stub: Knex.MigratorConfig['stub'] = 'migrationTemplate.js';
  tableName: Knex.MigratorConfig['tableName'] = 'knex_migrations';

  // constructor() {
  // }

  // Must return a Promise containing a list of migrations.
  // Migrations can be whatever you want,
  // they will be passed as arguments to getMigrationName
  // and getMigration
  getMigrations() {
    // In this example we are just returning migration names
    return Promise.resolve(['migration1']);
  }

  getNewMigrationName(name: string) {
    const safeName = (typeof name === 'string' && name != '') || name != null
      ? name
      : 'migration';

    return `${Date.now()}-${safeName}.ts`;
  }

  getMigrationName(migration: string) {
    return migration;
  }

  getMigration(migration: string) {
    switch (migration) {
      case 'migration1':
      default:
        return {
          up(knex: Knex) {
            /* ... */
          },
          down(knex: Knex) {
            /* ... */
          },
        };
    }
  }
}

// Update with your config settings.

type KnexMigrationConfig = {
  [key: string]: Knex.Config;
}

const config: KnexMigrationConfig = {
  development: {
    ...commonKnexConfig,
    connection: {
      database: process.env.PG_DATABASE_NAME,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
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

// module.exports = config;
export default config;
