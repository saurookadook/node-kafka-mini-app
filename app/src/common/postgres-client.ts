import util from 'node:util';
import knex from 'knex';

import { commonKnexConfig } from '@/db/knexfile';
import { halfW, fullW } from '@/utils';

const pgClientConfig = {
  client: commonKnexConfig.client,
  connection: {
    ...commonKnexConfig.connection,
    // host: process.env.PG_HOST,
    // port: Number(process.env.PG_PORT),
    // user: process.env.PG_USER,
    // password: process.env.PG_PASSWORD,
    // database: process.env.PG_DATABASE_NAME,
    // ssl: process.env.POSTGRES_SSL ? { rejectUnauthorized: false }: false
  },
  debug: true,
  extension: commonKnexConfig.extension,
  // postProcessResponse: (result, queryContext) => {
  //   // TODO: add special case for raw results
  //   // (depends on dialect)
  //   if (Array.isArray(result)) {
  //     return result.map((row) => convertToCamel(row));
  //   } else {
  //     return convertToCamel(result);
  //   }
  // },
};

console.log(
  '    postgres-client    '.padStart(halfW, '?').padEnd(fullW, '?'),
  '\n',
  '\n---- commonKnexConfig\n',
  util.inspect(commonKnexConfig, { colors: true, depth: null }),
  '\n---- pgClientConfig\n',
  util.inspect(pgClientConfig, { colors: true, depth: null }),
  '\n',
  ''.padStart(fullW, "?"),
);

const postgresClient = knex(pgClientConfig);

export { postgresClient };
