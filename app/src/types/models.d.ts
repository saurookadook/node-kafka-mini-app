export type MessageSchema = {
  type: string;
  namespace: string;
  name: string;
  fields: Array<{
    name: string;
    type: string;
    logicalType?: string;
  }>;
}

export type TopicSchemaItem = {
  topicName: string;
  subjectName: string;
  messageSchema: MessageSchema;
}

export type TopicSchemas = TopicSchemaItem[];

export type RandomPerson = Record<string, unknown> & {
  id: ReturnType<typeof crypto.randomUUID>;
  firstName: string;
  lastName: string;
  birthDate: number;
}

export type RandomPersonDBRecord = {
  id: RandomPerson['id'];
  first_name: RandomPerson['firstName'];
  last_name: RandomPerson['lastName'];
  birth_date: ReturnType<Date['toISOString']>;
}
