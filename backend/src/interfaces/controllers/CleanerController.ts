import { NextFunction, Request, Response } from 'express';

import { ICleanerRepository } from '../../domain/repositories/ICleanerRepository';
import { TimeSlot } from '../../domain/value-objects/TimeSlot';
import { ValidationError } from '../../shared/errors/HttpError';

export class CleanerController {
  constructor(private readonly cleanerRepository: ICleanerRepository) {}

  list = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const { start, end, postalCode } = request.query;
      if (start && end) {
        const cleaners = await this.cleanerRepository.findAvailable(
          new TimeSlot(new Date(String(start)), new Date(String(end))),
          postalCode ? String(postalCode) : undefined,
        );
        response.status(200).json({ success: true, data: cleaners });
        return;
      }

      const cleaners = await this.cleanerRepository.findAll();
      response.status(200).json({ success: true, data: cleaners });
    } catch (error) {
      next(error instanceof Error ? error : new ValidationError('Invalid cleaner query')); 
    }
  };
}
