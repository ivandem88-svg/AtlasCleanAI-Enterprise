import request from 'supertest';

import { createApp } from '../../src/app';
import { Booking } from '../../src/domain/entities/Booking';
import { Cleaner } from '../../src/domain/entities/Cleaner';
import { User } from '../../src/domain/entities/User';
import { IBookingRepository } from '../../src/domain/repositories/IBookingRepository';
import { ICleanerRepository } from '../../src/domain/repositories/ICleanerRepository';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository';
import { TimeSlot } from '../../src/domain/value-objects/TimeSlot';
import { EmailService } from '../../src/infrastructure/services/EmailService';
import { JwtService } from '../../src/infrastructure/services/JwtService';
import { hashValue } from '../../src/shared/utils/crypto';

class InMemoryBookingRepository implements IBookingRepository {
  private readonly bookings = new Map<string, Booking>();
  async findById(id: string): Promise<Booking | null> { return this.bookings.get(id) ?? null; }
  async findByUserId(userId: string): Promise<Booking[]> { return Array.from(this.bookings.values()).filter((booking) => booking.userId === userId); }
  async findByCleanerId(cleanerId: string): Promise<Booking[]> { return Array.from(this.bookings.values()).filter((booking) => booking.cleanerId === cleanerId); }
  async findAll(): Promise<Booking[]> { return Array.from(this.bookings.values()); }
  async findConflictingBookings(cleanerId: string, start: Date, end: Date): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter((booking) => booking.cleanerId === cleanerId && booking.timeSlot.start < end && booking.timeSlot.end > start);
  }
  async create(booking: Booking): Promise<Booking> { this.bookings.set(booking.id, booking); return booking; }
  async update(booking: Booking): Promise<Booking> { this.bookings.set(booking.id, booking); return booking; }
}

class InMemoryUserRepository implements IUserRepository {
  constructor(private readonly user: User) {}
  async findById(id: string): Promise<User | null> { return id === this.user.id ? this.user : null; }
  async findByEmail(email: string): Promise<User | null> { return email === this.user.email ? this.user : null; }
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

class EmailServiceStub {
  async sendWelcomeEmail(): Promise<void> {}
  async sendMail(): Promise<void> {}
}

describe('Booking routes', () => {
  it('creates a booking through HTTP', async () => {
    const jwtService = new JwtService();
    const passwordHash = await hashValue('StrongPass123');
    const user = new User({
      id: 'dab46979-c2aa-4298-bfff-b537d122a07d',
      email: 'booking@example.com',
      passwordHash,
      firstName: 'Booking',
      lastName: 'User',
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

    const cleaners = [new Cleaner({
      id: '38193f1e-e79a-4d0b-9f0e-40876dcd3a5d',
      firstName: 'Ready',
      lastName: 'Cleaner',
      email: 'cleaner@example.com',
      rating: 4.8,
      completedJobs: 75,
      skills: ['standard'],
      serviceAreas: ['94107'],
      availability: [{ dayOfWeek: new Date(Date.now() + 86400000).getUTCDay(), startHour: 0, endHour: 23 }],
      vehicleAvailable: true,
      backgroundChecked: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })];

    const app = createApp({
      userRepository: new InMemoryUserRepository(user) as any,
      bookingRepository: new InMemoryBookingRepository() as any,
      cleanerRepository: new InMemoryCleanerRepository(cleaners),
      emailService: new EmailServiceStub() as unknown as EmailService,
      jwtService,
    });

    const tokens = jwtService.generateAuthTokens({ id: user.id, email: user.email, role: user.role, tokenVersion: 0 });
    const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const response = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', 'Bearer ' + tokens.accessToken)
      .send({
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
        extras: [],
      });

    expect(response.status).toBe(201);
    expect(response.body.data.cleanerId).toBe(cleaners[0].id);
  });
});
