import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { NotFoundError, ValidationError } from '../../../shared/errors/HttpError';
import { UpdateBookingInput } from '../../dtos/BookingDto';

export class UpdateBookingUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(bookingId: string, input: UpdateBookingInput) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (input.scheduledStart || input.scheduledEnd) {
      if (!input.scheduledStart || !input.scheduledEnd) {
        throw new ValidationError('Both start and end times are required when rescheduling');
      }
      booking.updateSchedule(new Date(input.scheduledStart), new Date(input.scheduledEnd));
    }

    if (input.notes !== undefined) {
      booking.notes = input.notes;
    }
    if (input.status) {
      booking.status = input.status;
    }

    return this.bookingRepository.update(booking);
  }
}
