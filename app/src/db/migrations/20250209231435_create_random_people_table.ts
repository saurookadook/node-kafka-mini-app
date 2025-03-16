import type { Knex } from 'knex';

export const up = (knex: Knex) => {
  return knex.schema.createTable('random_people', function(table) {
    table.uuid('id', { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.string('first_name');
    table.string('last_name');
    table.timestamp('birth_date', { useTz: true }).defaultTo(knex.fn.now());
  });
};

export const down = (knex: Knex) => {
  return knex.schema.dropTable('random_people');
};
