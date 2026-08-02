import http from 'http';

import { Server as SocketIOServer } from 'socket.io';

import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { config } from './config';
import { connectRedis, disconnectRedis } from './config/redis';
import { logger } from './shared/utils/logger';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();
  await connectRedis();

  const app = createApp();
  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: {
      origin: config.clientUrl,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info('Socket client connected', { socketId: socket.id });

    socket.on('booking:subscribe', (bookingId: string) => {
      socket.join(`booking:${bookingId}`);
    });

    socket.on('disconnect', () => {
      logger.info('Socket client disconnected', { socketId: socket.id });
    });
  });

  server.listen(config.port, () => {
    logger.info(`AtlasCleanAI backend listening on port ${config.port}`);
  });

  const gracefulShutdown = async (signal: NodeJS.Signals): Promise<void> => {
    logger.info(`Received ${signal}. Starting graceful shutdown.`);
    server.close(async () => {
      await Promise.all([disconnectDatabase(), disconnectRedis()]);
      process.exit(0);
    });
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
};

bootstrap().catch((error) => {
  logger.error('Failed to bootstrap server', { error: error.message, stack: error.stack });
  process.exit(1);
});
