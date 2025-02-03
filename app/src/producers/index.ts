import util from 'node:util';
import { Producer } from 'kafkajs';
import { faker } from '@faker-js/faker';

import { topicSchemas, type PersonTopicRecord } from '@/_schemas/register-schemas';
import { getMiniAppKafkaProducer } from '@/common/kafka-clients';
import { Services } from '@/constants';
import { fullW, halfW, loggers, spacer } from '@/utils';

const producersLogger = loggers.get(Services.PRODUCERS);

const personTopicSchema = topicSchemas[0];
let producer: Producer = null;

// TODO: Move this to utils
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
  logInfoWithNewlines(`    begin - intermittentlyProduceMessages @ ${Date.now()}`.padStart(halfW, '-'));
  const recordKey = global.crypto.randomUUID();
  logInfoWithNewlines(`${spacer}recordKey: ${recordKey}`);
  const personRecord = generateRandomPerson();
  producersLogger.info(util.inspect(personRecord, { colors: true, depth: null }));

  const outgoingMessage = {
    key: recordKey,
    value: JSON.stringify(personRecord),
  };

  logInfoWithNewlines(`    Producing message for key '${recordKey}'...`.padStart(halfW, '?'));
  await producer.send({
    topic: personTopicSchema.topicName,
    messages: [outgoingMessage],
  });
  logInfoWithNewlines(`    Success! Produced message for key '${recordKey}' :D`.padStart(halfW, '!'));

  await randomDelay();

  return outgoingMessage;
}

async function producersMain() {
  producer = await getMiniAppKafkaProducer();

  logInfoWithNewlines('    producers - main    '.padStart(halfW, '=').padEnd(fullW, '='));
  logInfoWithNewlines(`${spacer}Starting producers...`);

  await producer.connect().catch((e) => {
    producersLogger.error('    ERROR opening producer connection    '.padStart(halfW, '!').padEnd(fullW, '!'));
    producersLogger.error(e);
  });

  while(producer != null) {
    try {
      await intermittentlyProduceMessages();
    } catch (e) {
      producersLogger.error('    Error during producing    '.padStart(halfW, '!').padEnd(fullW, '!'));
      producersLogger.error(e);
      producer.disconnect();
      producer = null;
    }
  }

  logInfoWithNewlines(`    Producers shutting down...`.padStart(halfW, '=').padEnd(fullW, '='));
};

producersMain().catch(async (e) => {
  producersLogger.error('    SOMETHING WENT BOOM    '.padStart(halfW, '!').padEnd(fullW, '!'));
  producersLogger.error(e);

  if (producer != null) {
    await producer.disconnect();
  }

  producersLogger.info(''.padStart(110, '='));
  process.exit(1);
});
