import { NextFunction, Request, Response } from 'express';

import { Cleaner } from '../../domain/entities/Cleaner';
import { ICleanerRepository } from '../../domain/repositories/ICleanerRepository';
import { TimeSlot } from '../../domain/value-objects/TimeSlot';
import { ValidationError } from '../../shared/errors/HttpError';

const toPublicCleaner = (cleaner: Cleaner) => ({
  id: cleaner.id,
  firstName: cleaner.firstName,
  lastName: cleaner.lastName,
  rating: cleaner.rating,
  completedJobs: cleaner.completedJobs,
  skills: cleaner.skills,
  serviceAreas: cleaner.serviceAreas,
  availability: cleaner.availability,
  vehicleAvailable: cleaner.vehicleAvailable,
  backgroundChecked: cleaner.backgroundChecked,
  createdAt: cleaner.createdAt,
  updatedAt: cleaner.updatedAt,
});

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
        response.status(200).json({ success: true, data: cleaners.map(toPublicCleaner) });
        return;
      }

      const cleaners = await this.cleanerRepository.findAll();
      response.status(200).json({ success: true, data: cleaners.map(toPublicCleaner) });
    } catch (error) {
      next(error instanceof Error ? error : new ValidationError('Invalid cleaner query')); 
    }
  };
}
