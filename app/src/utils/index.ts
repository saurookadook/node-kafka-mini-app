import { faker } from '@faker-js/faker';

import { RandomPerson } from '@/models';
import { logInfoWithNewlines, spacer } from '@/utils/logger';

export function generateRandomPerson(): RandomPerson {
  const randomPerson = new RandomPerson({
    id: global.crypto.randomUUID(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    birthDate: faker.date.birthdate(),
  });

  return randomPerson;
}

const between0And5SecondsInMilli = () => (Math.random() * 5) * 1000;

export async function randomDelay() {
  return new Promise((resolve) => {
    const delayMs = between0And5SecondsInMilli();

    logInfoWithNewlines(`${spacer}Random delay of ${delayMs / 1000} seconds...`);

    setTimeout(() => {
      resolve(true);
    }, delayMs);
  });
}

export * from '@/utils/case-converters';
export * from '@/utils/logger';
