import winston from 'winston';

import { Services } from '@/constants';
import '@/utils/logger';

const miniAppLogger = winston.loggers.get(Services.MINI_APP);

function main() {
  console.log('\n');
  console.log('    mini-app - main    '.padStart(100, '=').padEnd(180, '='));
  console.log('\n');
  miniAppLogger.info(`Hello, ${Services.MINI_APP} world!`);
}

main();
