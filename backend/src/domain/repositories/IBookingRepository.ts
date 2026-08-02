import { Booking } from '../entities/Booking';

export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByCleanerId(cleanerId: string): Promise<Booking[]>;
  findAll(): Promise<Booking[]>;
  findConflictingBookings(cleanerId: string, start: Date, end: Date): Promise<Booking[]>;
  create(booking: Booking): Promise<Booking>;
  update(booking: Booking): Promise<Booking>;
}
