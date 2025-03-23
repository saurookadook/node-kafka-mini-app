import { QueryBuilder } from "knex";

import { topicSchemas } from "@/_schemas/topics";
import { postgresClient } from "@/common";
import { DBTables } from "@/constants";
import type { RandomPersonRecord } from "@/types";

interface RepositoryOperations<T> {
  findById(id: ReturnType<typeof crypto.randomUUID>): T | QueryBuilder;
  findAll(): T[] | QueryBuilder;
  save(entity: T): T;
  update(entity: T): T;
  deleteById(id: ReturnType<typeof crypto.randomUUID>): boolean;
}

class RandomPersonRepository implements RepositoryOperations<RandomPersonRecord> {
  static dbSchema = DBTables[0];
  static topicSchema = topicSchemas[0];

  id: RandomPersonRecord['id'];
  firstName: RandomPersonRecord['firstName'];
  lastName: RandomPersonRecord['lastName'];
  birthDate: RandomPersonRecord['birthDate'];



  constructor(record: RandomPersonRecord) {
    this.id = record.id;
    this.firstName = record.firstName;
    this.lastName = record.lastName;
    this.birthDate = record.birthDate;
  }

  findById(id: RandomPersonRecord['id']) {
    return postgresClient
      .select('*')
      .from<RandomPersonRecord>(RandomPersonRepository.dbSchema.name)
      .where({ id })
      .limit(1)
      .first();
  }

  findAll() {
    return postgresClient
      .select('*')
      .from<RandomPersonRecord>(RandomPersonRepository.dbSchema.name)
      .limit(20);
  }

  save(entity: RandomPersonRecord): RandomPersonRecord {
    console.warn('[RandomPersonRepository.save] IMPLEMENT ME! :D');
    return entity;
  }

  update(entity: RandomPersonRecord): RandomPersonRecord {
    console.warn('[RandomPersonRepository.update] IMPLEMENT ME! :D');
    return entity;
  }

  deleteById(id: ReturnType<typeof crypto.randomUUID>): boolean {
    console.warn('[RandomPersonRepository.deleteById] IMPLEMENT ME! :D');
    return false;
  }


}

export default RandomPersonRepository;
