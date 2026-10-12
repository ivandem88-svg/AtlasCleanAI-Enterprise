import { CleanerRepository } from '../../../src/infrastructure/database/repositories/CleanerRepository';
import { prisma } from '../../../src/config/database';
import { TimeSlot } from '../../../src/domain/value-objects/TimeSlot';
import { logger } from '../../../src/shared/utils/logger';

jest.mock('../../../src/shared/utils/logger', () => ({
  logger: { error: jest.fn() },
}));

jest.mock('../../../src/config/database', () => ({
  prisma: {
    cleaner: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const findMany = prisma.cleaner.findMany as unknown as jest.Mock;
const findUnique = prisma.cleaner.findUnique as unknown as jest.Mock;

const buildRecord = (availability: unknown, id = '38193f1e-e79a-4d0b-9f0e-40876dcd3a5d') => ({
  id,
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
    findUnique.mockReset();
    (logger.error as jest.Mock).mockReset();
  });

  it('accepts valid availability windows', async () => {
    findMany.mockResolvedValue([buildRecord([{ dayOfWeek: 2, startHour: 8, endHour: 18 }])]);

    const cleaners = await new CleanerRepository().findAll();

    expect(cleaners[0].availability).toEqual([{ dayOfWeek: 2, startHour: 8, endHour: 18 }]);
  });

  it.each([
    ['a negative start hour', { dayOfWeek: 2, startHour: -1, endHour: 18 }],
    ['an end hour above 24', { dayOfWeek: 2, startHour: 8, endHour: 25 }],
    ['a start hour that is not before the end hour', { dayOfWeek: 2, startHour: 18, endHour: 8 }],
    ['an empty window', { dayOfWeek: 2, startHour: 8, endHour: 8 }],
    ['a weekday outside 0-6', { dayOfWeek: 7, startHour: 8, endHour: 18 }],
    ['a negative weekday', { dayOfWeek: -1, startHour: 8, endHour: 18 }],
    ['fractional hours', { dayOfWeek: 2, startHour: 8.5, endHour: 18 }],
    ['a fractional weekday', { dayOfWeek: 1.5, startHour: 8, endHour: 18 }],
  ])('rejects %s', async (_description, window) => {
    findUnique.mockResolvedValue(buildRecord([window]));

    await expect(new CleanerRepository().findById('38193f1e-e79a-4d0b-9f0e-40876dcd3a5d')).rejects.toThrow(
      'invalid time window',
    );
  });

  describe('with one malformed cleaner among valid ones', () => {
    const validId = '11111111-1111-4111-8111-111111111111';
    const malformedId = '22222222-2222-4222-8222-222222222222';
    const validRecord = buildRecord([{ dayOfWeek: 2, startHour: 8, endHour: 18 }], validId);
    const malformedRecord = buildRecord([{ dayOfWeek: 2, startHour: -1, endHour: 25 }], malformedId);

    beforeEach(() => {
      findMany.mockResolvedValue([malformedRecord, validRecord]);
    });

    it('findAll returns the valid cleaners and logs the skipped one', async () => {
      const cleaners = await new CleanerRepository().findAll();

      expect(cleaners.map((cleaner) => cleaner.id)).toEqual([validId]);
      expect(logger.error).toHaveBeenCalledWith(
        'Skipping cleaner with invalid stored data',
        expect.objectContaining({ cleanerId: malformedId }),
      );
    });

    it('findAvailable still returns the valid available cleaners', async () => {
      const slot = new TimeSlot(new Date('2030-01-01T09:00:00Z'), new Date('2030-01-01T11:00:00Z'));

      const cleaners = await new CleanerRepository().findAvailable(slot);

      expect(cleaners.map((cleaner) => cleaner.id)).toEqual([validId]);
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
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
