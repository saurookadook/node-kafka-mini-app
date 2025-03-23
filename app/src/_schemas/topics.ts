import { ConsumerGroups } from '@/constants';
import type { TopicSchemas } from '@/types';

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
