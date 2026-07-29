import { createLogger, format, transports } from 'winston';

import { config } from '../../config';

export const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    format.json(),
  ),
  defaultMeta: { service: 'atlasclean-backend', environment: config.env },
  transports: [
    new transports.Console({
      format:
        config.env === 'development'
          ? format.combine(format.colorize(), format.timestamp(), format.printf(({ level, message, timestamp, stack, ...meta }) => `${timestamp} ${level}: ${stack ?? message}${Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''}`))
          : format.json(),
    }),
  ],
});
