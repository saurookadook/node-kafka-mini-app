import { Kafka, KafkaConfig, Producer, ProducerConfig } from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { SchemaRegistryAPIClientOptions } from '@kafkajs/confluent-schema-registry/dist/@types';
import { SchemaRegistryAPIClientArgs } from '@kafkajs/confluent-schema-registry/dist/api';
import { KafkaJS } from '@confluentinc/kafka-javascript';
import { SchemaRegistryClient } from '@confluentinc/schemaregistry';

const serverURLs = {
  brokers: [
    'broker-1:9092',
    'broker-2:9093',
    'broker-3:9094',
  ],
  schemaRegistry: ['http://schema-registry:8081'],
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

const kafkaClient = new KafkaJS.Kafka({
    kafkaJS: {
        brokers: [
          // 'localhost:9092'
          ...serverURLs.brokers,
        ],
    },
});

export async function getKafkaClient({
  producerConfig,
}: {
  producerConfig?: ProducerConfig;
}) {
  const config = await getConfig();
  const kafka: Kafka = new Kafka({
    clientId: 'mini-app',
    ...config.kafkaEnvConfig,
  });
}

const schemaRegistry = new SchemaRegistryClient({
    baseURLs: [
      // 'http://localhost:8081'
      ...serverURLs.schemaRegistry,
],
});

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

export function createMiniAppSchemaRegistry(
  schemaRegistryConfig: SchemaRegistryAPIClientArgs,
  options?: SchemaRegistryAPIClientOptions,
): MiniAppSchemaRegistry {
  const schemaRegistry = new SchemaRegistry(schemaRegistryConfig, options);

  async function getLatestCachedSchemaId(topicName: string): Promise<number> {
    // TODO: implement me :D
    return schemaRegistry.getLatestSchemaId(topicName);
  }

  return Object.assign(schemaRegistry, {
    getLatestCachedSchemaId,
  });
}

export { kafkaClient, schemaRegistry };
