import { AvroDeserializer, SerdeType } from '@confluentinc/schemaregistry';
import winston from 'winston';

import { topicSchemas } from '@/_schemas/register-schemas';
import { kafkaClient, schemaRegistry } from '@/common/kafka-clients';
import { ConsumerGroups, Services } from '@/constants';

const consumersLogger = winston.loggers.get(Services.CONSUMERS);

const personTopicSchema = topicSchemas[0];

let consumer = kafkaClient.consumer({
  kafkaJS: {
    groupId: ConsumerGroups.RANDOM_PEOPLE,
    fromBeginning: true,
  },
});

// async function main() {
const main = async () => {
  consumersLogger.info('\n');
  consumersLogger.info('    consumers - main    '.padStart(80, '='),
    // .padEnd(180, '=')
  );
  consumersLogger.info('\n');

  consumersLogger.info('    Starting consumers...',
    // .padStart(100, '-')
  );
  const avroDeserializer = new AvroDeserializer(schemaRegistry, SerdeType.VALUE, {});

  await consumer.connect();
  await consumer.subscribe({ topic: personTopicSchema.topicName });

  let messageReceived = false;
  consumersLogger.info('    Waiting for messages...',
    // .padStart(100, '-')
  );
  await consumer.run({
    eachMessage: async ({ message }) => {
      const recordValue =
        await avroDeserializer.deserialize(personTopicSchema.topicName, message.value);
      const decodedMessage = {
        ...message,
        value: recordValue,
      };
      consumersLogger.info(
        `Consumer received message.\nBefore decoding: ${JSON.stringify(message)}` +
        `\nAfter decoding: ${JSON.stringify(decodedMessage)}`,
      );
      messageReceived = true;
    },
  });

  while(!messageReceived) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await consumer.disconnect();
  consumer = null;
};

main().catch(async (e) => {
  consumersLogger.error(e);

  if (consumer != null) {
    await consumer.disconnect();
  }

  consumersLogger.info(''.padStart(110, '='));
  process.exit(1);
});
