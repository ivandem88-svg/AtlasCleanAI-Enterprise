import request from 'supertest';

import { createApp } from '../../src/app';
import { Cleaner } from '../../src/domain/entities/Cleaner';
import { ICleanerRepository } from '../../src/domain/repositories/ICleanerRepository';

class InMemoryCleanerRepository implements ICleanerRepository {
  constructor(private readonly cleaners: Cleaner[]) {}
  async findById(id: string): Promise<Cleaner | null> { return this.cleaners.find((cleaner) => cleaner.id === id) ?? null; }
  async findAll(): Promise<Cleaner[]> { return this.cleaners; }
  async findAvailable(): Promise<Cleaner[]> { return this.cleaners; }
}

const cleaner = new Cleaner({
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
});

describe('Cleaner routes', () => {
  const app = createApp({ cleanerRepository: new InMemoryCleanerRepository([cleaner]) });

  it('does not expose contact details or schedules when listing cleaners', async () => {
    const response = await request(app).get('/api/v1/cleaners');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
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
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).not.toHaveProperty('email');
    expect(response.body.data[0]).not.toHaveProperty('phone');
    expect(response.body.data[0]).not.toHaveProperty('userId');
    expect(response.body.data[0]).not.toHaveProperty('availability');
  });
});
