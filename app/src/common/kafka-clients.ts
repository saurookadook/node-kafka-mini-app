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

const kafkaClient = new KafkaJS.Kafka({
    kafkaJS: {
        brokers: [
          // 'localhost:9092'
          ...serverURLs.brokers,
        ],
    },
});

const schemaRegistry = new SchemaRegistryClient({
    baseURLs: [
      // 'http://localhost:8081'
      ...serverURLs.schemaRegistry,
],
});

export { kafkaClient, schemaRegistry };
