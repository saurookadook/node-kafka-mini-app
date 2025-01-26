import winston from 'winston';

import { Services } from '@/constants';

const producersLogger = winston.loggers.get(Services.PRODUCERS);

producersLogger.info(`Hello, ${Services.PRODUCERS} world!`);
