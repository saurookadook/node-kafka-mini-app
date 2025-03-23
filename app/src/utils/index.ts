import { faker } from '@faker-js/faker';

import { type PersonTopicRecord } from '@/_schemas/topics';
import { logInfoWithNewlines, spacer } from '@/utils/logger';

function calculateAge(birthDate: Date): number {
  const now = new Date();
  const age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  const isPastBirthdate =
    (monthDiff > 0 || (monthDiff === 0 && now.getDate() >= birthDate.getDate()));
  return isPastBirthdate ? age : age - 1;
}

export function generateRandomPerson(): PersonTopicRecord & { age: number } {
  const birthDate = faker.date.birthdate();

  return {
    id: global.crypto.randomUUID(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: calculateAge(birthDate),
    birthDate: birthDate.getTime(),
  };
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
