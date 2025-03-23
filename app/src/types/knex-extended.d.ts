import { Knex } from 'knex';

import { RandomPerson } from '@/types/Models';

declare module 'knex/types/tables' {
  interface User {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }

  interface Tables {
    random_people: RandomPerson;
  }
}
