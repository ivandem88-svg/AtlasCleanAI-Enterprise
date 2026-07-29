import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

import { validateSchema } from '../../../shared/utils/validator';

export const validate = <T>(schema: ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') => {
  return (request: Request, _response: Response, next: NextFunction): void => {
    try {
      const parsed = validateSchema(schema, request[source]);
      Object.assign(request[source], parsed);
      next();
    } catch (error) {
      next(error);
    }
  };
};
