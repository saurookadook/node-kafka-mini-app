import winston from 'winston';

import { Services, type ServicesKey } from '@/constants';

const { combine, timestamp, label, printf } = winston.format;

const primaryFormat = printf(({ label, level, message, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const combinedFormat = (labelName: ServicesKey | string) =>
  combine(
    label({ label: labelName }),
    timestamp(),
    primaryFormat,
  );

type LoggerOptionsArgs = {
  labelName?: ServicesKey | string;
}

const createWinstonLoggerOptions = ({
  labelName,
  ...options
}: LoggerOptionsArgs & winston.LoggerOptions) => ({
  defaultMeta: { service: 'node-kafka-mini-app' },
  format: combinedFormat(labelName),
  level: 'info',
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
  ...options,
});

const logger = winston.createLogger(createWinstonLoggerOptions({ labelName: 'root' }));

for (const key in Services) {
  winston.loggers.add(Services[key as ServicesKey], {
    ...createWinstonLoggerOptions({ labelName: key }),
  });
}

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }

export default logger;
