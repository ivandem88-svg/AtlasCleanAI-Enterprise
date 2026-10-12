import request from 'supertest';

import { createApp } from '../../src/app';
import { Cleaner } from '../../src/domain/entities/Cleaner';
import { ICleanerRepository } from '../../src/domain/repositories/ICleanerRepository';
import { TimeSlot } from '../../src/domain/value-objects/TimeSlot';

class InMemoryCleanerRepository implements ICleanerRepository {
  constructor(private readonly cleaners: Cleaner[]) {}
  async findById(id: string): Promise<Cleaner | null> { return this.cleaners.find((cleaner) => cleaner.id === id) ?? null; }
  async findAll(): Promise<Cleaner[]> { return this.cleaners; }
  async findAvailable(slot: TimeSlot, postalCode?: string): Promise<Cleaner[]> {
    return this.cleaners.filter(
      (cleaner) => cleaner.isAvailable(slot) && (!postalCode || cleaner.serviceAreas.includes(postalCode)),
    );
  }
}

const buildCleaner = (overrides: Partial<ConstructorParameters<typeof Cleaner>[0]> = {}): Cleaner =>
  new Cleaner({
    id: '38193f1e-e79a-4d0b-9f0e-40876dcd3a5d',
    userId: 'dab46979-c2aa-4298-bfff-b537d122a07d',
    firstName: 'Ready',
    lastName: 'Cleaner',
    email: 'cleaner@example.com',
    phone: '+14155550100',
    rating: 4.8,
    completedJobs: 75,
    skills: ['standard'],
    serviceAreas: ['94107'],
    availability: [{ dayOfWeek: 1, startHour: 8, endHour: 18 }],
    vehicleAvailable: true,
    backgroundChecked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

const cleaner = buildCleaner();
const otherAreaCleaner = buildCleaner({
  id: '5b0c4f3e-6a52-4d62-8f8e-1f7c2f3a9b10',
  userId: undefined,
  firstName: 'Far',
  lastName: 'Away',
  email: 'far@example.com',
  serviceAreas: ['10001'],
});

describe('Cleaner routes', () => {
  const app = createApp({ cleanerRepository: new InMemoryCleanerRepository([cleaner, otherAreaCleaner]) });

  it('does not expose contact details or schedules when listing cleaners', async () => {
    const response = await request(app).get('/api/v1/cleaners');

    expect(response.status).toBe(200);
    expect(response.body.data.map((entry: { id: string }) => entry.id)).toEqual([cleaner.id, otherAreaCleaner.id]);
    expect(response.body.data[0]).toMatchObject({ id: cleaner.id, firstName: 'Ready', lastName: 'Cleaner', rating: 4.8 });
    expect(response.body.data[0]).not.toHaveProperty('email');
    expect(response.body.data[0]).not.toHaveProperty('phone');
    expect(response.body.data[0]).not.toHaveProperty('userId');
    expect(response.body.data[0]).not.toHaveProperty('availability');
  });

  it('does not expose contact details or schedules when listing available cleaners', async () => {
    const response = await request(app)
      .get('/api/v1/cleaners')
      .query({ start: '2030-01-07T09:00:00Z', end: '2030-01-07T11:00:00Z', postalCode: '94107' });

    expect(response.status).toBe(200);
    expect(response.body.data.map((entry: { id: string }) => entry.id)).toEqual([cleaner.id]);
    expect(response.body.data[0]).not.toHaveProperty('email');
    expect(response.body.data[0]).not.toHaveProperty('phone');
    expect(response.body.data[0]).not.toHaveProperty('userId');
    expect(response.body.data[0]).not.toHaveProperty('availability');
  });

  it('returns no cleaners when the requested slot is outside their availability', async () => {
    const response = await request(app)
      .get('/api/v1/cleaners')
      .query({ start: '2030-01-07T17:30:00Z', end: '2030-01-07T18:30:00Z', postalCode: '94107' });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  it('returns no cleaners when none serve the requested postal code', async () => {
    const response = await request(app)
      .get('/api/v1/cleaners')
      .query({ start: '2030-01-07T09:00:00Z', end: '2030-01-07T11:00:00Z', postalCode: '60601' });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });
});
