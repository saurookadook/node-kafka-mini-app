// import * as path from 'node:path';
import { schemaRegistry } from '@/common/kafka-clients';
import logger from '@/utils/logger';

type MessageSchema = {
  type: string;
  namespace: string;
  name: string;
  fields: Array<{
    name: string;
    type: string;
  }>;
}

type TopicSchemaItem = {
  topicNam: string;
  subjectName: string;
  messageSchema: MessageSchema;
}

type TopicSchemas = TopicSchemaItem[];

export const topicSchemas: TopicSchemas = [
  {
    topicNam: 'test-topic',
    subjectName: 'test-topic-value',
    messageSchema: {
      type: 'record',
      namespace: 'examples',
      name: 'RandomTest',
      fields: [
        {
          name: 'fullName',
          type: 'string',
        },
      ],
    },
  },
];

const registerSchemas = async (schemas: TopicSchemas = topicSchemas) => {
  const { subjectName, messageSchema } = schemas[0];

  logger.info(`Registering schema for topic '${subjectName}'`);
  const id = await schemaRegistry.register(
    subjectName,
    {
      schemaType: 'AVRO',
      schema: JSON.stringify(messageSchema),
    },
  ).catch((e) => {
    logger.error(`Failed to register schema for topic '${subjectName}'\n`, e);
    return e;
  });

  if (id instanceof Error) {
    throw id;
  }

  logger.info(`Topic '${subjectName}' registration successful!`, ` ID: ${id}`);
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
