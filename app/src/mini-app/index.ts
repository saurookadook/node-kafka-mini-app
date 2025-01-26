import winston from 'winston';

import registerSchemas from '@/_schemas/register-schemas';
import { Services } from '@/constants';
import '@/utils/logger';

const miniAppLogger = winston.loggers.get(Services.MINI_APP);

async function main() {
  console.log('\n');
  console.log('    mini-app - main    '.padStart(100, '=').padEnd(180, '='));
  console.log('\n');

  await registerSchemas().catch(async (e) => {
    miniAppLogger.error(e);
  });

  miniAppLogger.info('Finished registering schemas!');
}

main().finally(() => {
  miniAppLogger.info("Shutting down 'mini-app'...");
  process.exit(1);
});
