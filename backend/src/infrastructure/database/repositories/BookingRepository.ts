import { Booking as PrismaBooking, Prisma } from '@prisma/client';

import { prisma } from '../../../config/database';
import { Booking } from '../../../domain/entities/Booking';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';

const toDomain = (record: PrismaBooking): Booking =>
  new Booking({
    id: record.id,
    userId: record.userId,
    cleanerId: record.cleanerId ?? undefined,
    serviceId: record.serviceId ?? undefined,
    serviceType: record.serviceType,
    address: record.address as any,
    timeSlot: { start: record.startTime, end: record.endTime },
    durationMinutes: record.durationMinutes,
    amount: Number(record.amount),
    currency: record.currency,
    status: record.status,
    notes: record.notes ?? undefined,
    extras: record.extras,
    aiMetadata: (record.aiMetadata as Record<string, unknown> | null | undefined) ?? undefined,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

export class BookingRepository implements IBookingRepository {
  async findById(id: string): Promise<Booking | null> {
    const record = await prisma.booking.findUnique({ where: { id } });
    return record ? toDomain(record) : null;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const records = await prisma.booking.findMany({ where: { userId }, orderBy: { startTime: 'desc' } });
    return records.map(toDomain);
  }

  async findByCleanerId(cleanerId: string): Promise<Booking[]> {
    const records = await prisma.booking.findMany({ where: { cleanerId }, orderBy: { startTime: 'desc' } });
    return records.map(toDomain);
  }

  async findAll(): Promise<Booking[]> {
    const records = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
    return records.map(toDomain);
  }

  async findConflictingBookings(cleanerId: string, start: Date, end: Date): Promise<Booking[]> {
    const records = await prisma.booking.findMany({
      where: {
        cleanerId,
        status: { not: 'CANCELLED' },
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    return records.map(toDomain);
  }

  async create(booking: Booking): Promise<Booking> {
    const record = await prisma.booking.create({
      data: {
        id: booking.id,
        userId: booking.userId,
        cleanerId: booking.cleanerId,
        serviceId: booking.serviceId,
        serviceType: booking.serviceType,
        address: booking.address.toJSON() as unknown as Prisma.InputJsonValue,
        startTime: booking.timeSlot.start,
        endTime: booking.timeSlot.end,
        durationMinutes: booking.durationMinutes,
        amount: new Prisma.Decimal(booking.amount.amount),
        currency: booking.amount.currency,
        status: booking.status,
        notes: booking.notes,
        extras: booking.extras,
        aiMetadata: booking.aiMetadata as Prisma.InputJsonValue,
      },
    });

    return toDomain(record);
  }

  async update(booking: Booking): Promise<Booking> {
    const record = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        cleanerId: booking.cleanerId,
        serviceId: booking.serviceId,
        serviceType: booking.serviceType,
        address: booking.address.toJSON() as unknown as Prisma.InputJsonValue,
        startTime: booking.timeSlot.start,
        endTime: booking.timeSlot.end,
        durationMinutes: booking.durationMinutes,
        amount: new Prisma.Decimal(booking.amount.amount),
        currency: booking.amount.currency,
        status: booking.status,
        notes: booking.notes,
        extras: booking.extras,
        aiMetadata: booking.aiMetadata as Prisma.InputJsonValue,
      },
    });

    return toDomain(record);
  }
}
