import util from 'node:util';
import { AvroSerializer, SerdeType } from '@confluentinc/schemaregistry';
import { faker } from '@faker-js/faker';
import winston from 'winston';

import { topicSchemas, type PersonTopicRecord } from '@/_schemas/register-schemas';
import { kafkaClient, schemaRegistry } from '@/common/kafka-clients';
import { Services } from '@/constants';

const producersLogger = winston.loggers.get(Services.PRODUCERS);

const personTopicSchema = topicSchemas[0];
const avroSerializer = new AvroSerializer(
  schemaRegistry,
  SerdeType.VALUE,
  { useLatestVersion: true },
);

let producer = kafkaClient.producer();

function generateRandomPerson(): PersonTopicRecord {
  const birthDateAsNegativeInt = faker.date.birthdate().getTime();
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({ min: 1, max: 100 }),
    birthDate: birthDateAsNegativeInt * -1,
  };
}

const between0And5SecondsInMilli = () => (Math.random() * 5) * 1000;

async function randomDelay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, between0And5SecondsInMilli());
  });
}

async function intermittentlyProduceMessages() {
  producersLogger.info(`begin - intermittentlyProduceMessages @ ${Date.now()}`);
  const recordKey = global.crypto.randomUUID();
  producersLogger.info(`recordKey: ${recordKey}`);
  const personRecord = generateRandomPerson();
  producersLogger.info(util.inspect(personRecord, { colors: true, depth: null }));
  // let recordValue = null;
  // try {
  //   recordValue = await avroSerializer.serialize(
  //     personTopicSchema.topicName,
  //     personRecord,
  //   );
  // } catch (e) {
  //   producersLogger.error(e);
  //   throw e;
  // }

  const outgoingMessage = {
    key: recordKey,
    value: await avroSerializer.serialize(
      personTopicSchema.topicName,
      personRecord,
    ),
    // key: 'key',
    // value: { ...personRecord },
  };

  producersLogger.info(`Producing message for key '${recordKey}'...`);
  await producer.send({
    topic: personTopicSchema.topicName,
    messages: [outgoingMessage],
  });
  producersLogger.info(`Success! Produced message for key '${recordKey}' :D`);

  await randomDelay();

  // return intermittentlyProduceMessages();
  return outgoingMessage;
}

// async function main() {
const main = async () => {
  producersLogger.info('\n');
  producersLogger.info('    producers - main    '.padStart(80, '='),
    // .padEnd(180, '=')
  );
  producersLogger.info('\n');

  producersLogger.info('    Starting producers...',
    // .padStart(100, '-')
  );
  await producer.connect();

  try {
    await intermittentlyProduceMessages();
  } catch (e) {
    producersLogger.error('    Error during producing    '.padStart(50, '!').padEnd(75, '!'));
    producersLogger.error(e);
    producer.disconnect();
    producer = null;
  }
  producersLogger.info('    Producers shutting down...',
    // .padStart(100, '-')
  );
};

main().catch(async (e) => {
  producersLogger.error('    SOMETHING WENT BOOM    '.padStart(50, '!').padEnd(75, '!'));
  producersLogger.error(e);

  if (producer != null) {
    await producer.disconnect();
  }

  producersLogger.info(''.padStart(110, '='));
  process.exit(1);
});
