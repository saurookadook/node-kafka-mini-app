import winston from 'winston';

import { Services } from '@/constants';

const consumersLogger = winston.loggers.get(Services.CONSUMERS);

consumersLogger.info(`Hello, ${Services.CONSUMERS} world!`);
