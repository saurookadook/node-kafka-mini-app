import util from 'node:util';
import { Producer } from 'kafkajs';

import { topicSchemas } from '@/_schemas/register-schemas';
import { getMiniAppKafkaProducer } from '@/common/kafka-clients';
import { Services } from '@/constants';
import {
  fullW,
  generateRandomPerson,
  halfW,
  loggers,
  logInfoWithNewlines,
  randomDelay,
  spacer,
} from '@/utils';

const producersLogger = loggers.get(Services.PRODUCERS);

const personTopicSchema = topicSchemas[0];
let producer: Producer = null;

// TODO: this is a little hacky :]
const localLogInfo = (message: string) => {
  logInfoWithNewlines(message, producersLogger);
};

async function intermittentlyProduceMessages() {
  localLogInfo(`    begin - intermittentlyProduceMessages @ ${Date.now()}`.padStart(halfW, '-'));
  const recordKey = global.crypto.randomUUID();
  localLogInfo(`${spacer}recordKey: ${recordKey}`);
  const personRecord = generateRandomPerson();
  producersLogger.info(util.inspect(personRecord, { colors: true, depth: null }));

  const outgoingMessage = {
    key: recordKey,
    value: JSON.stringify(personRecord),
  };

  localLogInfo(`    Producing message for key '${recordKey}'...`.padStart(halfW, '?'));
  await producer.send({
    topic: personTopicSchema.topicName,
    messages: [outgoingMessage],
  });
  localLogInfo(`    Success! Produced message for key '${recordKey}' :D`.padStart(halfW, '!'));

  await randomDelay();

  return outgoingMessage;
}

async function producersMain() {
  producer = await getMiniAppKafkaProducer();

  localLogInfo('    producers - main    '.padStart(halfW, '=').padEnd(fullW, '='));
  localLogInfo(`${spacer}Starting producers...`);

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

  localLogInfo(`    Producers shutting down...`.padStart(halfW, '=').padEnd(fullW, '='));
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
