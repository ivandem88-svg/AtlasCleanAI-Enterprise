import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../../shared/errors/AppError';
import { logger } from '../../../shared/utils/logger';

export const errorHandler = (error: Error, request: Request, response: Response, _next: NextFunction): void => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      traceId: request.headers['x-request-id'] ?? undefined,
    });
    return;
  }

  logger.error('Unhandled error', {
    message: error.message,
    stack: error.stack,
    path: request.path,
    method: request.method,
  });

  response.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};
