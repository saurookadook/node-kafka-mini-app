import { ConsumerGroups } from '@/constants';

type MessageSchema = {
  type: string;
  namespace: string;
  name: string;
  fields: Array<{
    name: string;
    type: string;
    logicalType?: string;
  }>;
}

type TopicSchemaItem = {
  topicName: string;
  subjectName: string;
  messageSchema: MessageSchema;
}

export type TopicSchemas = TopicSchemaItem[];

export type PersonTopicRecord = {
  id: ReturnType<typeof crypto.randomUUID>;
  firstName: string;
  lastName: string;
  birthDate: number;
}

export const Topics = {
  RANDOM_PEOPLE: {
    topicName: ConsumerGroups.RANDOM_PEOPLE,
    subjectName: `${ConsumerGroups.RANDOM_PEOPLE}-value`,
  },
};

export const topicSchemas: TopicSchemas = [
  {
    topicName: Topics.RANDOM_PEOPLE.topicName,
    subjectName: Topics.RANDOM_PEOPLE.subjectName,
    messageSchema: {
      type: 'record',
      namespace: 'miniApp',
      name: 'Person',
      fields: [
        {
          name: 'id',
          type: 'string',
          logicalType: 'uuid',
        },
        {
          name: 'firstName',
          type: 'string',
        },
        {
          name: 'lastName',
          type: 'string',
        },
        {
          name: 'birthDate',
          type: 'int', // Unix timestamp
        },
      ],
    },
  },
];
