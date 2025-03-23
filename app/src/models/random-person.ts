import { topicSchemas } from "@/_schemas/topics";
import { DBTables } from "@/constants";
import type { RandomPerson, RandomPersonDBRecord } from "@/types";

class RandomPersonFactory {
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

  dbRecordMap(): RandomPersonDBRecord {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      birth_date: new Date(this.birthDate).toISOString(),
    };
  }
}

export default RandomPersonFactory;
