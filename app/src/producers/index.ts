import util from 'node:util';
import { Producer } from 'kafkajs';
import winston from 'winston';
import { faker } from '@faker-js/faker';

import { topicSchemas, type PersonTopicRecord } from '@/_schemas/register-schemas';
import { getMiniAppKafkaProducer } from '@/common/kafka-clients';
import { Services } from '@/constants';

const producersLogger = winston.loggers.get(Services.PRODUCERS);

const personTopicSchema = topicSchemas[0];
let producer: Producer = null;

const spacer = ''.padStart(24, ' ');

function logInfoWithNewlines(message: string) {
  producersLogger.info('\n');
  producersLogger.info(message);
  producersLogger.info('\n');
}

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
    const delayMs = between0And5SecondsInMilli();

    logInfoWithNewlines(`${spacer}Random delay of ${delayMs / 1000} seconds...`);

    setTimeout(() => {
      resolve(true);
    }, delayMs);
  });
}

async function intermittentlyProduceMessages() {
  logInfoWithNewlines(`    begin - intermittentlyProduceMessages @ ${Date.now()}`.padStart(100, '-'));
  const recordKey = global.crypto.randomUUID();
  logInfoWithNewlines(`recordKey: ${recordKey}`);
  const personRecord = generateRandomPerson();
  producersLogger.info(util.inspect(personRecord, { colors: true, depth: null }));

  const outgoingMessage = {
    key: recordKey,
    value: JSON.stringify(personRecord),
  };

  logInfoWithNewlines(`    Producing message for key '${recordKey}'...`.padStart(100, '?'));
  await producer.send({
    topic: personTopicSchema.topicName,
    messages: [outgoingMessage],
  });
  logInfoWithNewlines(`    Success! Produced message for key '${recordKey}' :D`.padStart(100, '!'));

  await randomDelay();

  return outgoingMessage;
}

async function main() {
  producer = await getMiniAppKafkaProducer();

  logInfoWithNewlines('    producers - main    '.padStart(80, '='));

  logInfoWithNewlines(`${spacer}Starting producers...`);
  await producer.connect().catch((e) => {
    producersLogger.error('    ERROR opening producer connection    '.padStart(60, '!').padEnd(120, '!'));
    producersLogger.error(e);
  });

  while(producer != null) {
    try {
      await intermittentlyProduceMessages();
    } catch (e) {
      producersLogger.error('    Error during producing    '.padStart(50, '!').padEnd(75, '!'));
      producersLogger.error(e);
      producer.disconnect();
      producer = null;
    }
  }

  logInfoWithNewlines(`    Producers shutting down...`.padStart(60, '=').padEnd(120, '='));
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
