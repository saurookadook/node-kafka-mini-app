export const ConsumerGroups = {
  RANDOM_PEOPLE: 'random-people',
};

export const Services = {
  CONSUMERS: 'CONSUMERS',
  MINI_APP: 'MINI_APP',
  PRODUCERS: 'PRODUCERS',
  SCHEMA_REGISTRY: 'SCHEMA_REGISTRY',
} as const;

export type ServicesKey = keyof typeof Services;
