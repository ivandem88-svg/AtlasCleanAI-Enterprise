import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { UserRole } from '../../../shared/types';

export class GetBookingsUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(userId: string, role: UserRole) {
    if (role === 'ADMIN' || role === 'MANAGER') {
      return this.bookingRepository.findAll();
    }

    return this.bookingRepository.findByUserId(userId);
  }
}
