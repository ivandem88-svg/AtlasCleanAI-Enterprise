import { Booking } from '../../../src/domain/entities/Booking';
import { Cleaner } from '../../../src/domain/entities/Cleaner';
import { User } from '../../../src/domain/entities/User';
import { IBookingRepository } from '../../../src/domain/repositories/IBookingRepository';
import { ICleanerRepository } from '../../../src/domain/repositories/ICleanerRepository';
import { IUserRepository } from '../../../src/domain/repositories/IUserRepository';
import { TimeSlot } from '../../../src/domain/value-objects/TimeSlot';
import { DynamicPricingUseCase } from '../../../src/application/use-cases/ai/DynamicPricingUseCase';
import { SmartSchedulingUseCase } from '../../../src/application/use-cases/ai/SmartSchedulingUseCase';
import { CreateBookingUseCase } from '../../../src/application/use-cases/booking/CreateBookingUseCase';
import { AtlasAIService } from '../../../src/infrastructure/services/AtlasAIService';

class InMemoryBookingRepository implements IBookingRepository {
  private readonly bookings = new Map<string, Booking>();

  async findById(id: string): Promise<Booking | null> { return this.bookings.get(id) ?? null; }
  async findByUserId(userId: string): Promise<Booking[]> { return Array.from(this.bookings.values()).filter((booking) => booking.userId === userId); }
  async findByCleanerId(cleanerId: string): Promise<Booking[]> { return Array.from(this.bookings.values()).filter((booking) => booking.cleanerId === cleanerId); }
  async findAll(): Promise<Booking[]> { return Array.from(this.bookings.values()); }
  async findConflictingBookings(cleanerId: string, start: Date, end: Date): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.cleanerId === cleanerId && booking.timeSlot.start < end && booking.timeSlot.end > start,
    );
  }
  async create(booking: Booking): Promise<Booking> { this.bookings.set(booking.id, booking); return booking; }
  async update(booking: Booking): Promise<Booking> { this.bookings.set(booking.id, booking); return booking; }
}

class InMemoryUserRepository implements IUserRepository {
  constructor(private readonly user: User) {}
  async findById(id: string): Promise<User | null> { return id === this.user.id ? this.user : null; }
  async findByEmail(): Promise<User | null> { return this.user; }
  async create(user: User): Promise<User> { return user; }
  async update(user: User): Promise<User> { return user; }
}

class InMemoryCleanerRepository implements ICleanerRepository {
  constructor(private readonly cleaners: Cleaner[]) {}
  async findById(id: string): Promise<Cleaner | null> { return this.cleaners.find((cleaner) => cleaner.id === id) ?? null; }
  async findAll(): Promise<Cleaner[]> { return this.cleaners; }
  async findAvailable(slot: TimeSlot, postalCode?: string): Promise<Cleaner[]> {
    return this.cleaners.filter((cleaner) => cleaner.isAvailable(slot) && (!postalCode || cleaner.serviceAreas.includes(postalCode)));
  }
}

describe('CreateBookingUseCase', () => {
  it('creates a booking with AI price and cleaner recommendation', async () => {
    const customer = new User({
      id: '93eb16f6-6a0e-4e34-9e45-07669106a4cf',
      email: 'customer@example.com',
      passwordHash: 'hashed',
      firstName: 'Atlas',
      lastName: 'Customer',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      refreshTokenVersion: 0,
      emailVerified: true,
      preferences: {
        marketingOptIn: false,
        preferredLanguage: 'en',
        smsNotifications: true,
        emailNotifications: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const cleaners = [
      new Cleaner({
        id: 'bb9ae70c-d406-47b0-93c9-f81e509eb9ff',
        firstName: 'Maya',
        lastName: 'Santos',
        email: 'maya@example.com',
        rating: 4.9,
        completedJobs: 120,
        skills: ['standard', 'deep'],
        serviceAreas: ['94107'],
        availability: [{ dayOfWeek: new Date(Date.now() + 86400000).getUTCDay(), startHour: 0, endHour: 23 }],
        vehicleAvailable: true,
        backgroundChecked: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    const bookingRepository = new InMemoryBookingRepository();
    const atlasAIService = new AtlasAIService();
    const useCase = new CreateBookingUseCase(
      bookingRepository,
      new InMemoryUserRepository(customer),
      new DynamicPricingUseCase(atlasAIService),
      new SmartSchedulingUseCase(new InMemoryCleanerRepository(cleaners), bookingRepository, atlasAIService),
    );

    const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const booking = await useCase.execute({
      userId: customer.id,
      serviceType: 'standard',
      address: {
        line1: '123 Mission St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94107',
        country: 'US',
      },
      scheduledStart: start.toISOString(),
      scheduledEnd: end.toISOString(),
      extras: ['fridge'],
      notes: 'Ring the bell',
    });

    expect(booking.cleanerId).toBe(cleaners[0].id);
    expect(booking.status).toBe('ASSIGNED');
    expect(booking.amount.amount).toBeGreaterThan(0);
  });
});
