import { Consumer, EachMessagePayload } from 'kafkajs';
// eslint-disable-next-line
import util from 'node:util';

import { topicSchemas } from '@/_schemas/register-schemas';
import { getMiniAppKafkaConsumer } from '@/common/kafka-clients';
import { ConsumerGroups, Services } from '@/constants';
import { fullW, halfW, loggers, spacer } from '@/utils';

const consumersLogger = loggers.get(Services.CONSUMERS);

const personTopicSchema = topicSchemas[0];
let consumer: Consumer = null;

// TODO: Move this to utils
function logInfoWithNewlines(message: string) {
  consumersLogger.info('\n');
  consumersLogger.info(message);
  consumersLogger.info('\n');
}

async function consumersMain() {
  try {
    consumer = await getMiniAppKafkaConsumer({
      groupId: `${ConsumerGroups.RANDOM_PEOPLE}-group`,
    });

    logInfoWithNewlines('    consumers - main    '.padStart(halfW, '='));
    logInfoWithNewlines(`${spacer}Starting consumers...`);

    await consumer.connect();
    await consumer.subscribe({
      fromBeginning: true,
      topic: personTopicSchema.topicName,
    });

    logInfoWithNewlines('    Waiting for messages...'.padStart(halfW, '?'));

    await consumer.run({
      eachMessage: async ({ message, partition, topic }: EachMessagePayload) => {
        logInfoWithNewlines(`    Consumer received message!    `.padStart(halfW, '-').padEnd(fullW, '-'));
        consumersLogger.info(`TOPIC : ${topic} [PARTITION : ${partition} | OFFSET : ${message.offset}] / ${message.timestamp}`);
        // logInfoWithNewlines('    Full message:    '.padStart(halfW, '|').padEnd(fullW, '|'));
        // consumersLogger.info(util.inspect(message, { colors: true, depth: 2 }));
        logInfoWithNewlines(`Message value: ${message.value.toString()}`);
      },
    });
  } catch (e) {
    consumersLogger.error(`   ERROR in main    `.padStart(halfW, '!').padEnd(fullW, '!'));
    consumersLogger.error(e);

    if (consumer != null && typeof consumer.disconnect === 'function') {
      await consumer.disconnect();
    }
    consumer = null;

    throw e;
  }
};

consumersMain().catch(async (e) => {
  consumersLogger.error('    SOMETHING WENT BOOM    '.padStart(halfW, '!').padEnd(fullW, '!'));
  consumersLogger.error(e);

  if (consumer != null) {
    await consumer.disconnect();
  }

  consumersLogger.info(''.padStart(fullW, '='));
  process.exit(1);
});

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach((type) => {
  process.on(type, async (e) => {
    try {
      consumersLogger.error(`process.on ${type}`);
      consumersLogger.error(e);
      await consumer.disconnect();
      process.exit(0);
    } catch (e) {
      consumersLogger.error(e);
      process.exit(1);
    }
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});
