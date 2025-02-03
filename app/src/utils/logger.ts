import winston, { format, transports, type LoggerOptions } from 'winston';

import { Services, type ServicesKey } from '@/constants';

const { combine, timestamp, label, printf } = format;

const primaryFormat = printf(({ label, level, message, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const consoleFormat = (labelName: ServicesKey | string) =>
  combine(
    format.colorize(),
    label({ label: labelName }),
    timestamp(),
    // timestamp({ format: 'ddd, DD MMM YYYY HH:mm:ss ZZ' }),
    primaryFormat,
  );

type LoggerOptionsArgs = {
  labelName?: ServicesKey | string;
}

const createWinstonLoggerOptions = ({
  labelName,
  ...options
}: LoggerOptionsArgs & LoggerOptions) => ({
  defaultMeta: { service: 'node-kafka-mini-app' },
  format: consoleFormat(labelName),
  // level: 'info',
  transports: [
    new transports.Console({
      format: consoleFormat(labelName),
    }),
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({ filename: 'combined.log' }),
  ],
  ...options,
});

const logger = winston.createLogger(createWinstonLoggerOptions({ labelName: 'root' }));

for (const key in Services) {
  winston.loggers.add(Services[key as ServicesKey], {
    ...createWinstonLoggerOptions({ labelName: key }),
    transports: [
      new transports.Console({
        format: consoleFormat(key),
      }),
    ],
  });
}

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new transports.Console({
//     format: winston.format.simple(),
//   }));
// }

const { loggers } = winston;

const windowWidth = process.stdout.columns || 160;
/** @description Full width for padding values, adusted for prefix added by `primaryFormat` logger formatter */
const adjustedWindowWidth = (windowWidth) - 80;
const fullW = adjustedWindowWidth;
const halfW = Math.round(adjustedWindowWidth / 2);

const spacer = ''.padStart(24, ' ');

export {
  logger as rootLogger,
  fullW,
  halfW,
  loggers,
  spacer,
};
export default logger;
