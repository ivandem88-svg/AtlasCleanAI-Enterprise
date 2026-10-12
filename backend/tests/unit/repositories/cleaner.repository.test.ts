import { CleanerRepository } from '../../../src/infrastructure/database/repositories/CleanerRepository';
import { prisma } from '../../../src/config/database';
import { TimeSlot } from '../../../src/domain/value-objects/TimeSlot';

jest.mock('../../../src/config/database', () => ({
  prisma: {
    cleaner: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const findMany = prisma.cleaner.findMany as unknown as jest.Mock;

const buildRecord = (availability: unknown) => ({
  id: '38193f1e-e79a-4d0b-9f0e-40876dcd3a5d',
  userId: null,
  firstName: 'Ready',
  lastName: 'Cleaner',
  email: 'cleaner@example.com',
  phone: null,
  rating: 4.8,
  completedJobs: 75,
  skills: ['standard'],
  serviceAreas: ['94107'],
  availability,
  vehicleAvailable: true,
  backgroundChecked: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('CleanerRepository availability parsing', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('accepts valid availability windows', async () => {
    findMany.mockResolvedValue([buildRecord([{ dayOfWeek: 2, startHour: 8, endHour: 18 }])]);

    const cleaners = await new CleanerRepository().findAll();

    expect(cleaners[0].availability).toEqual([{ dayOfWeek: 2, startHour: 8, endHour: 18 }]);
  });

  it.each([
    ['hours outside the day', { dayOfWeek: 2, startHour: -1, endHour: 25 }],
    ['a start hour that is not before the end hour', { dayOfWeek: 2, startHour: 18, endHour: 8 }],
    ['an empty window', { dayOfWeek: 2, startHour: 8, endHour: 8 }],
    ['a weekday outside 0-6', { dayOfWeek: 7, startHour: 8, endHour: 18 }],
    ['a negative weekday', { dayOfWeek: -1, startHour: 8, endHour: 18 }],
    ['fractional hours', { dayOfWeek: 2, startHour: 8.5, endHour: 18 }],
    ['a fractional weekday', { dayOfWeek: 1.5, startHour: 8, endHour: 18 }],
  ])('rejects %s', async (_description, window) => {
    findMany.mockResolvedValue([buildRecord([window])]);

    await expect(new CleanerRepository().findAll()).rejects.toThrow('invalid time window');
  });
});

describe('CleanerRepository.findAvailable', () => {
  const slot = new TimeSlot(new Date('2030-01-01T09:00:00Z'), new Date('2030-01-01T11:00:00Z'));

  beforeEach(() => {
    findMany.mockReset();
    findMany.mockResolvedValue([]);
  });

  it('only queries cleaners that passed their background check', async () => {
    await new CleanerRepository().findAvailable(slot);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { backgroundChecked: true } }),
    );
  });

  it('keeps the background check filter when narrowing by postal code', async () => {
    await new CleanerRepository().findAvailable(slot, '94107');

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { backgroundChecked: true, serviceAreas: { has: '94107' } },
      }),
    );
  });
});
