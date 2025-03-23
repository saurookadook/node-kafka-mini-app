// import * as path from 'node:path';
import { SchemaType } from '@kafkajs/confluent-schema-registry';
import { AvroConfluentSchema, RawAvroSchema } from '@kafkajs/confluent-schema-registry/dist/@types';

import { getMiniAppSchemaRegistry } from '@/common/kafka-clients';
import { Services } from '@/constants';
import { loggers } from '@/utils';
import { TopicSchemas, topicSchemas } from './topics';

const schemaRegistryLogger = loggers.get(Services.MINI_APP);

export const registerSchemas = async (schemas: TopicSchemas = topicSchemas) => {
  const { subjectName, messageSchema } = schemas[0];

  schemaRegistryLogger.info(`Registering schema for topic '${subjectName}'`);
  // const id = await schemaRegistry.register(
  //   subjectName,
  //   {
  //     schemaType: 'AVRO',
  //     schema: JSON.stringify(messageSchema),
  //   },
  // ).catch((e) => {
  //   schemaRegistryLogger.error(`Failed to register schema for topic '${subjectName}'\n`, e);
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
        schemaRegistryLogger.error(`[miniAppSchemaRegistry.register] Failed to register schema for topic '${subjectName}'\n`, e);
        return e;
      });

      if (id instanceof Error) {
        throw id;
      }

      schemaRegistryLogger.info(`Topic '${subjectName}' registration successful!`, ` ID: ${id}`);
  } catch (error) {
    schemaRegistryLogger.error(`[registerSchemas] Failed while registering schemas: \n`, error);
  }
};

async function main() {
  console.log('\n');
  console.log('    mini-app - main    '.padStart(100, '=').padEnd(180, '='));
  console.log('\n');

  await registerSchemas().catch(async (e) => {
    schemaRegistryLogger.error(e);
  });

  schemaRegistryLogger.info('Finished registering schemas!');
}

main().finally(() => {
  schemaRegistryLogger.info("Shutting down 'mini-app'...");
  process.exit(1);
});
