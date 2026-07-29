import { addMinutes } from 'date-fns';

import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { ICleanerRepository } from '../../../domain/repositories/ICleanerRepository';
import { TimeSlot } from '../../../domain/value-objects/TimeSlot';
import { AtlasAIService } from '../../../infrastructure/services/AtlasAIService';

export interface SmartSchedulingInput {
  postalCode: string;
  serviceType: string;
  start: Date;
  end: Date;
}

export class SmartSchedulingUseCase {
  constructor(
    private readonly cleanerRepository: ICleanerRepository,
    private readonly bookingRepository: IBookingRepository,
    private readonly atlasAIService: AtlasAIService,
  ) {}

  async execute(input: SmartSchedulingInput) {
    const slot = new TimeSlot(input.start, input.end);
    const availableCleaners = await this.cleanerRepository.findAvailable(slot, input.postalCode);

    const scoredCleaners = await this.atlasAIService.optimizeSchedule({
      serviceType: input.serviceType,
      postalCode: input.postalCode,
      slot,
      cleaners: availableCleaners,
    });

    const recommendedCleaner = scoredCleaners[0];
    const conflicts = recommendedCleaner
      ? await this.bookingRepository.findConflictingBookings(recommendedCleaner.cleanerId, input.start, input.end)
      : [];

    const alternativeSlots = [15, 30, 45].map((offset) => ({
      start: addMinutes(input.start, offset).toISOString(),
      end: addMinutes(input.end, offset).toISOString(),
    }));

    return {
      recommendedCleanerId: conflicts.length === 0 ? recommendedCleaner?.cleanerId : undefined,
      confidence: conflicts.length === 0 ? recommendedCleaner?.score ?? 0 : 0,
      rankedCleaners: scoredCleaners,
      alternativeSlots,
    };
  }
}
