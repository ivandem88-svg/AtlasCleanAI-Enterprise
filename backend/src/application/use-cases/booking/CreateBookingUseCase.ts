import { v4 as uuidv4 } from 'uuid';

import { CreateBookingInput } from '../../dtos/BookingDto';
import { Booking } from '../../../domain/entities/Booking';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { NotFoundError, ValidationError } from '../../../shared/errors/HttpError';
import { DynamicPricingUseCase } from '../ai/DynamicPricingUseCase';
import { SmartSchedulingUseCase } from '../ai/SmartSchedulingUseCase';

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly userRepository: IUserRepository,
    private readonly dynamicPricingUseCase: DynamicPricingUseCase,
    private readonly smartSchedulingUseCase: SmartSchedulingUseCase,
  ) {}

  async execute(input: CreateBookingInput & { userId: string }) {
    const customer = await this.userRepository.findById(input.userId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const scheduledStart = new Date(input.scheduledStart);
    const scheduledEnd = new Date(input.scheduledEnd);
    if (scheduledStart <= new Date()) {
      throw new ValidationError('Bookings must be scheduled in the future');
    }
    if (scheduledEnd <= scheduledStart) {
      throw new ValidationError('Booking end time must be after the start time');
    }

    const pricing = await this.dynamicPricingUseCase.execute({
      address: input.address,
      serviceType: input.serviceType,
      scheduledStart,
      scheduledEnd,
      extras: input.extras,
    });

    const scheduleRecommendation = await this.smartSchedulingUseCase.execute({
      postalCode: input.address.postalCode,
      serviceType: input.serviceType,
      start: scheduledStart,
      end: scheduledEnd,
    });

    const booking = new Booking({
      id: uuidv4(),
      userId: customer.id,
      cleanerId: scheduleRecommendation.recommendedCleanerId,
      serviceId: input.serviceId,
      serviceType: input.serviceType,
      address: input.address,
      timeSlot: { start: scheduledStart, end: scheduledEnd },
      durationMinutes: Math.round((scheduledEnd.getTime() - scheduledStart.getTime()) / (1000 * 60)),
      amount: pricing.finalPrice,
      currency: pricing.currency,
      status: scheduleRecommendation.recommendedCleanerId ? 'ASSIGNED' : 'PENDING',
      notes: input.notes,
      extras: input.extras,
      aiMetadata: {
        pricing,
        scheduling: scheduleRecommendation,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.bookingRepository.create(booking);
  }
}
