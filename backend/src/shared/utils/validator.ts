import { ZodSchema } from 'zod';

import { ValidationError } from '../errors/HttpError';

export const validateSchema = <T>(schema: ZodSchema<T>, payload: unknown): T => {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new ValidationError('Payload validation failed', result.error.flatten());
  }

  return result.data;
};
