import { KafkaJS } from '@confluentinc/kafka-javascript';
import { SchemaRegistryClient } from '@confluentinc/schemaregistry';

const kafkaClient = new KafkaJS.Kafka({
    kafkaJS: {
        brokers: ['localhost:9092'],
    },
});

const schemaRegistry = new SchemaRegistryClient({
    baseURLs: ['http://localhost:8081'],
});

export { kafkaClient, schemaRegistry };
