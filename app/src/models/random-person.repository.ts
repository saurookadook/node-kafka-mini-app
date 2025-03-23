import { QueryBuilder } from "knex";

import { RandomPerson, topicSchemas } from "@/_schemas/topics";
import { postgresClient } from "@/common";
import { DBTables } from "@/constants";

interface RepositoryOperations<T> {
  findById(id: ReturnType<typeof crypto.randomUUID>): T | QueryBuilder;
  findAll(): T[] | QueryBuilder;
  save(entity: T): T;
  update(entity: T): T;
  deleteById(id: ReturnType<typeof crypto.randomUUID>): boolean;
}

class RandomPersonRepository implements RepositoryOperations<RandomPerson> {
  static dbSchema = DBTables[0];
  static topicSchema = topicSchemas[0];

  id: RandomPerson['id'];
  firstName: RandomPerson['firstName'];
  lastName: RandomPerson['lastName'];
  birthDate: RandomPerson['birthDate'];



  constructor(record: RandomPerson) {
    this.id = record.id;
    this.firstName = record.firstName;
    this.lastName = record.lastName;
    this.birthDate = record.birthDate;
  }

  findById(id: RandomPerson['id']) {
    return postgresClient
      .select('*')
      .from<RandomPerson>(RandomPersonRepository.dbSchema.name)
      .where({ id })
      .limit(1)
      .first();
  }

  findAll() {
    return postgresClient
      .select('*')
      .from<RandomPerson>(RandomPersonRepository.dbSchema.name)
      .limit(20);
  }

  save(entity: RandomPerson): RandomPerson {
    console.warn('[RandomPersonRepository.save] IMPLEMENT ME! :D');
    return entity;
  }

  update(entity: RandomPerson): RandomPerson {
    console.warn('[RandomPersonRepository.update] IMPLEMENT ME! :D');
    return entity;
  }

  deleteById(id: ReturnType<typeof crypto.randomUUID>): boolean {
    console.warn('[RandomPersonRepository.deleteById] IMPLEMENT ME! :D');
    return false;
  }


}

export default RandomPersonRepository;
