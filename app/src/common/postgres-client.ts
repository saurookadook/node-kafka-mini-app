import knex from 'knex';

import { commonKnexConfig } from '@/db/knexfile';

const postgresClient = knex({
  client: 'pg',
  connection: {
    ...commonKnexConfig.connection,
    // host: process.env.PG_HOST,
    // port: Number(process.env.PG_PORT),
    // user: process.env.PG_USER,
    // password: process.env.PG_PASSWORD,
    // database: process.env.PG_DATABASE_NAME,
    // ssl: process.env.POSTGRES_SSL ? { rejectUnauthorized: false }: false
  },
});

export { postgresClient };
