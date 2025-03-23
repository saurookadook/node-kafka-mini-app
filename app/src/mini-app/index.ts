import util from 'node:util';
import { Producer } from 'kafkajs';

import { topicSchemas } from '@/_schemas/topics';
import {
  postgresClient,
  getMiniAppKafkaProducer,
} from '@/common';
import { DBTables, Services } from '@/constants';
import { RandomPerson } from '@/models';
import {
  camelToSnake,
  fullW,
  generateRandomPerson,
  halfW,
  loggers,
  logInfoWithNewlines,
  randomDelay,
  spacer,
} from '@/utils';

const miniAppLogger = loggers.get(Services.MINI_APP);

const randomPeopleSchema = DBTables[0];
const personTopicSchema = topicSchemas[0];
let producer: Producer = null;

// TODO: this is a little hacky :]
const localLogInfo = (message: string) => {
  logInfoWithNewlines(message, miniAppLogger);
};

async function insertRecord(personRecord: RandomPerson) {
  let trx;

  try {
    trx = await postgresClient.transaction();
  } catch (e: unknown) {
    miniAppLogger.error('    ERROR starting transaction    '.padStart(halfW, '!').padEnd(fullW, '!'));
    miniAppLogger.error(e);
    throw e;
  }

  // const recordWithSnakeCaseKeys = Object.keys(personRecord).reduce((acc, key) => {
  //   const snakeCaseKey = camelToSnake(key);
  //   acc[snakeCaseKey] = personRecord[key];
  //   return acc;
  // }, {} as Record<string, unknown>);

  try {
    const result = await trx(randomPeopleSchema.name)
      .returning('*')
      .insert(personRecord.createDBRecordMap())
      .onConflict('id')
      .merge();
    localLogInfo(`${spacer}Successfully inserted record: '${personRecord.id}'${spacer}`.padStart(halfW, '!').padEnd(fullW, '!'));
    miniAppLogger.info(util.inspect(result, { colors: true, depth: null }));
    await trx.commit();
    return result;
  } catch (e: unknown) {
    miniAppLogger.error(
      `    ERROR inserting record: '${personRecord.id}'    `.padStart(halfW, '!').padEnd(fullW, '!'),
      e,
    );
    await trx.rollback();
    return null;
  }

}

/**
 * @description Intermittently does the following:
 * 1. Generates random person record.
 * 2. Saves it to database.
 * 3. If save is successful, produces that person to 'random-people' topic.
 */
async function intermittentlyCreatePerson() {
  localLogInfo(`    begin - intermittentlyProduceMessages @ ${Date.now()}`.padStart(halfW, '-'));
  const personRecord = generateRandomPerson();
  miniAppLogger.info(`personRecord for '${personRecord.firstName} ${personRecord.lastName}'`);
  miniAppLogger.info(util.inspect({
    id: personRecord.id,
    firstName: personRecord.firstName,
    lastName: personRecord.lastName,
    birthDate: personRecord.birthDate.getTime(),
    birthDateISO: personRecord.birthDate.toISOString(),
    age: RandomPerson.calculateAge(personRecord.birthDate),
  }, { colors: true, depth: null }));

  const personTopicRecord = personRecord.createTopicRecord();

  const outgoingMessage = {
    key: personTopicRecord.id,
    value: JSON.stringify(personTopicRecord),
  };

  const dbResult = await insertRecord(personRecord);

  if (dbResult != null) {
    localLogInfo(`    Producing message for key '${personTopicRecord.id}'...`.padStart(halfW, '?'));
    await producer.send({
      topic: personTopicSchema.topicName,
      messages: [outgoingMessage],
    });
    localLogInfo(`    Success! Produced message for key '${personTopicRecord.id}' :D`.padStart(halfW, '!'));
  }

  await randomDelay();

  return outgoingMessage;
}

async function getProducerAndOpenConnection() {
  localLogInfo(`${spacer}Starting and connecting to producers...`);
  const producer = await getMiniAppKafkaProducer();

  await producer.connect().catch((e) => {
    miniAppLogger.error('    ERROR opening producer connection    '.padStart(halfW, '!').padEnd(fullW, '!'));
    miniAppLogger.error(e);
  });

  localLogInfo(`${spacer}Producers started and connection open!`);
  return producer;
}

async function main() {
  localLogInfo('    mini-app - main    '.padStart(100, '=').padEnd(180, '='));

  producer = await getProducerAndOpenConnection();

  while(producer != null) {
    try {
      await intermittentlyCreatePerson();
    } catch (e: unknown) {
      miniAppLogger.error('    Error during producing    '.padStart(halfW, '!').padEnd(fullW, '!'));
      miniAppLogger.error(e);
      producer.disconnect();
      producer = null;
      throw e;
    }
  }

  localLogInfo(`    Producers shutting down...`.padStart(halfW, '=').padEnd(fullW, '='));
}

main().catch(async(e) => {
  miniAppLogger.error('    SOMETHING WENT BOOM    '.padStart(halfW, '!').padEnd(fullW, '!'));
  miniAppLogger.error(e);

  if (producer != null) {
    await producer.disconnect();
  }

  miniAppLogger.info(`${spacer}DONE :]${spacer}`.padStart(fullW, '='));
  process.exit(1);
}).finally(() => {
  miniAppLogger.info(`${spacer}Shutting down 'mini-app'...`);
  process.exit(1);
});
