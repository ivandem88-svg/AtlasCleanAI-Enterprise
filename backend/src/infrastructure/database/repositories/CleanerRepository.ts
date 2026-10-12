import { Cleaner as PrismaCleaner, Prisma } from '@prisma/client';

import { prisma } from '../../../config/database';
import { Cleaner, CleanerAvailability } from '../../../domain/entities/Cleaner';
import { ICleanerRepository } from '../../../domain/repositories/ICleanerRepository';
import { TimeSlot } from '../../../domain/value-objects/TimeSlot';
import { logger } from '../../../shared/utils/logger';

const parseAvailability = (value: Prisma.JsonValue): CleanerAvailability[] => {
  if (!Array.isArray(value)) {
    throw new Error('Cleaner availability must be an array');
  }

  return value.map((entry) => {
    if (
      typeof entry !== 'object' ||
      entry === null ||
      !('dayOfWeek' in entry) ||
      !('startHour' in entry) ||
      !('endHour' in entry) ||
      typeof entry.dayOfWeek !== 'number' ||
      typeof entry.startHour !== 'number' ||
      typeof entry.endHour !== 'number' ||
      !Number.isInteger(entry.dayOfWeek) ||
      !Number.isInteger(entry.startHour) ||
      !Number.isInteger(entry.endHour) ||
      entry.dayOfWeek < 0 ||
      entry.dayOfWeek > 6 ||
      entry.startHour < 0 ||
      entry.endHour > 24 ||
      entry.startHour >= entry.endHour
    ) {
      throw new Error('Cleaner availability contains an invalid time window');
    }

    return {
      dayOfWeek: entry.dayOfWeek,
      startHour: entry.startHour,
      endHour: entry.endHour,
    };
  });
};

const toDomain = (record: PrismaCleaner): Cleaner =>
  new Cleaner({
    id: record.id,
    userId: record.userId ?? undefined,
    firstName: record.firstName,
    lastName: record.lastName,
    email: record.email,
    phone: record.phone ?? undefined,
    rating: record.rating,
    completedJobs: record.completedJobs,
    skills: record.skills,
    serviceAreas: record.serviceAreas,
    availability: parseAvailability(record.availability),
    vehicleAvailable: record.vehicleAvailable,
    backgroundChecked: record.backgroundChecked,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const toDomainList = (records: PrismaCleaner[]): Cleaner[] =>
  records.flatMap((record) => {
    try {
      return [toDomain(record)];
    } catch (error) {
      logger.error('Skipping cleaner with invalid stored data', {
        cleanerId: record.id,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  });

export class CleanerRepository implements ICleanerRepository {
  async findById(id: string): Promise<Cleaner | null> {
    const record = await prisma.cleaner.findUnique({ where: { id } });
    return record ? toDomain(record) : null;
  }

  async findAll(): Promise<Cleaner[]> {
    const records = await prisma.cleaner.findMany({ orderBy: { createdAt: 'desc' } });
    return toDomainList(records);
  }

  async findAvailable(slot: TimeSlot, postalCode?: string): Promise<Cleaner[]> {
    const records = await prisma.cleaner.findMany({
      where: {
        backgroundChecked: true,
        ...(postalCode ? { serviceAreas: { has: postalCode } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return toDomainList(records).filter((cleaner) => cleaner.isAvailable(slot));
  }
}
