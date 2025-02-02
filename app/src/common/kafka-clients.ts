import {
  Consumer,
  ConsumerConfig,
  Kafka,
  KafkaConfig,
  Producer,
  ProducerConfig,
} from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { SchemaRegistryAPIClientOptions } from '@kafkajs/confluent-schema-registry/dist/@types';
import { SchemaRegistryAPIClientArgs } from '@kafkajs/confluent-schema-registry/dist/api';

import { Services } from '@/constants';
import { loggers } from '@/utils';

const miniAppLogger = loggers.get(Services.MINI_APP);

const serverURLs = {
  brokers: [
    'broker-1:9092',
    'broker-2:9093',
    'broker-3:9094',
  ],
  schemaRegistry: [
    'http://schema-registry:8081',
    ],
};

export type Config = {
  kafkaEnvConfig: Pick<KafkaConfig, 'brokers'>;
  schemaRegistryHost: string;
}

const localConfig: Config = {
  kafkaEnvConfig: {
    brokers: [...serverURLs.brokers],
  },
  schemaRegistryHost: serverURLs.schemaRegistry[0],
};

let currentConfig: Config | null = null;

export async function getConfig(): Promise<Config> {
  if (!currentConfig) {
    currentConfig = localConfig;
  }
  return currentConfig;
}

export async function getKafkaClient() {
  const config = await getConfig();
  miniAppLogger.info('[getKafkaClient] initializing Kafka client with brokers: ');
  miniAppLogger.info(JSON.stringify({ brokers: serverURLs.brokers }, null, 4));
  const kafka: Kafka = new Kafka({
    clientId: 'mini-app',
    ...config.kafkaEnvConfig,
  });

  return kafka;
}

export async function getMiniAppKafkaProducer({
  producerConfig,
}: {
  producerConfig?: ProducerConfig;
} = {}): Promise<Producer> {
  const kafkaClient = await getKafkaClient();
  return kafkaClient.producer(producerConfig);
}

export async function getMiniAppKafkaConsumer({
  consumerConfig,
  groupId,
}: {
  consumerConfig: ConsumerConfig;
  groupId: string;
}): Promise<Consumer> {
  const kafkaClient = await getKafkaClient();
  return kafkaClient.consumer({
    ...consumerConfig,
    groupId: groupId,
  });
}

export interface MiniAppSchemaRegistry extends SchemaRegistry {
  getLatestCachedSchemaId: (topicName: string) => Promise<number>;
}

let schemaRegistrySingleton: MiniAppSchemaRegistry;

export async function getMiniAppSchemaRegistry(
  schemaRegistryConfig?: SchemaRegistryAPIClientArgs,
) {
  const config = await getConfig();

  if (schemaRegistrySingleton == null) {
    schemaRegistrySingleton = createMiniAppSchemaRegistry({
      host: config.schemaRegistryHost,
      ...schemaRegistryConfig,
    });
  }

  return schemaRegistrySingleton;
}

type CacheValue = {
  latest: number;
  nextUpdate: number;
}
type SchemaIdCache = {
  [topicName: string]: CacheValue;
};

function updateCacheAndGetLatest({
  cacheObj,
  topicName,
  latestVal,
}: {
  cacheObj: SchemaIdCache;
  topicName: string;
  latestVal: number;
}) {
  cacheObj[topicName] = {
    latest: latestVal,
    nextUpdate: Date.now() + 1000 * 60, // 60 seconds
  };

  return latestVal;
}

export function createMiniAppSchemaRegistry(
  schemaRegistryConfig: SchemaRegistryAPIClientArgs,
  options?: SchemaRegistryAPIClientOptions,
): MiniAppSchemaRegistry {
  const schemaRegistry = new SchemaRegistry(schemaRegistryConfig, options);
  const schemaIdCache: SchemaIdCache = {};

  async function getLatestCachedSchemaId(topicName: string): Promise<number> {
    if (schemaIdCache[topicName] == null) {
      return schemaRegistry.getLatestSchemaId(topicName).then((latestId) => {
        return updateCacheAndGetLatest({
          cacheObj: schemaIdCache,
          topicName,
          latestVal: latestId,
        });
      });
    } else if (schemaIdCache[topicName].nextUpdate < Date.now()) {
      return schemaRegistry.getLatestSchemaId(topicName).then((latestId) => {
        return updateCacheAndGetLatest({
          cacheObj: schemaIdCache,
          topicName,
          latestVal: latestId,
        });
      });
    }
    return schemaIdCache[topicName].latest;
  }

  return Object.assign(schemaRegistry, {
    getLatestCachedSchemaId,
  });
}
