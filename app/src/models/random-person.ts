import { topicSchemas } from "@/_schemas/topics";
import { DBTables } from "@/constants";
import type { RandomPersonRecord, RandomPersonDBRecord } from "@/types";

// TODO: not sure why `Omit<RandomPerson, 'birthDate'>` isn't including the other properties
type ConstructorArgs = {
  id: RandomPersonRecord['id'];
  firstName: RandomPersonRecord['firstName'];
  lastName: RandomPersonRecord['lastName'];
  birthDate: Date | number | string
};

class RandomPerson {
  static dbSchema = DBTables[0];
  static topicSchema = topicSchemas[0];

  id: RandomPersonRecord['id'];
  firstName: RandomPersonRecord['firstName'];
  lastName: RandomPersonRecord['lastName'];
  birthDate: Date;

  constructor(record: ConstructorArgs) {
    this.id = record.id;
    this.firstName = record.firstName;
    this.lastName = record.lastName;
    this.birthDate = new Date(record.birthDate);
  }

  createDBRecordMap(): RandomPersonDBRecord {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      birth_date: new Date(this.birthDate).toISOString(),
    };
  }

  createTopicRecord(): RandomPersonRecord {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate.getTime(),
    };
  }

  /**
   * @todo I'm not sure I like how this is implemented
   */
  get age(): number {
    return RandomPerson.calculateAge(this.birthDate);
  }

  static calculateAge(birthDate: Date): number {
    const now = new Date();
    const age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    const isPastBirthdate =
      (monthDiff > 0 || (monthDiff === 0 && now.getDate() >= birthDate.getDate()));
    return isPastBirthdate ? age : age - 1;
  }
}

export default RandomPerson;
