// import * as path from 'node:path';
import { SchemaType } from '@kafkajs/confluent-schema-registry';
import { AvroConfluentSchema, RawAvroSchema } from '@kafkajs/confluent-schema-registry/dist/@types';

import { getMiniAppSchemaRegistry } from '@/common/kafka-clients';
import { ConsumerGroups } from '@/constants';
import logger from '@/utils/logger';

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

type TopicSchemas = TopicSchemaItem[];

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

export const registerSchemas = async (schemas: TopicSchemas = topicSchemas) => {
  const { subjectName, messageSchema } = schemas[0];

  logger.info(`Registering schema for topic '${subjectName}'`);
  // const id = await schemaRegistry.register(
  //   subjectName,
  //   {
  //     schemaType: 'AVRO',
  //     schema: JSON.stringify(messageSchema),
  //   },
  // ).catch((e) => {
  //   logger.error(`Failed to register schema for topic '${subjectName}'\n`, e);
  //   return e;
  // });

  // if (id instanceof Error) {
  //   throw id;
  // }

  try {
    const miniAppSchemaRegistry = await getMiniAppSchemaRegistry();
    const registerArgs: [RawAvroSchema | AvroConfluentSchema, { subject: string }] = [
      { type: SchemaType.AVRO,
        schema: JSON.stringify(messageSchema),
      },
      {
        subject: subjectName,
      },
    ];
    const id = await miniAppSchemaRegistry
      .register(...registerArgs)
      .catch((e) => {
        logger.error(`[miniAppSchemaRegistry.register] Failed to register schema for topic '${subjectName}'\n`, e);
        return e;
      });

      if (id instanceof Error) {
        throw id;
      }

      logger.info(`Topic '${subjectName}' registration successful!`, ` ID: ${id}`);
  } catch (error) {
    logger.error(`[registerSchemas] Failed while registering schemas: \n`, error);
  }
};

export default registerSchemas;

// registerSchemas().catch(async (e) => {
//   console.error(e);
//   // consumer && await consumer.disconnect();
//   // producer && await producer.disconnect();

// })
//   .finally(() => {
//     logger.info('');
//     process.exit(1);
//   });
