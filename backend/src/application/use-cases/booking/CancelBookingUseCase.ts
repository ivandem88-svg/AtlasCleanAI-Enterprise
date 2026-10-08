import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { NotFoundError } from '../../../shared/errors/HttpError';

export class CancelBookingUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(bookingId: string, reason: string) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    booking.cancel(reason);
    return this.bookingRepository.update(booking);
  }
}
