import { Payment as PrismaPayment, Prisma } from '@prisma/client';

import { prisma } from '../../../config/database';
import { Payment } from '../../../domain/entities/Payment';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';

const toDomain = (record: PrismaPayment): Payment =>
  new Payment({
    id: record.id,
    bookingId: record.bookingId,
    userId: record.userId,
    amount: Number(record.amount),
    currency: record.currency,
    status: record.status,
    provider: record.provider,
    paymentIntentId: record.paymentIntentId ?? undefined,
    refundId: record.refundId ?? undefined,
    metadata: (record.metadata as Record<string, unknown> | null | undefined) ?? undefined,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

export class PaymentRepository implements IPaymentRepository {
  async findById(id: string): Promise<Payment | null> {
    const record = await prisma.payment.findUnique({ where: { id } });
    return record ? toDomain(record) : null;
  }

  async findByBookingId(bookingId: string): Promise<Payment | null> {
    const record = await prisma.payment.findUnique({ where: { bookingId } });
    return record ? toDomain(record) : null;
  }

  async create(payment: Payment): Promise<Payment> {
    const record = await prisma.payment.create({
      data: {
        id: payment.id,
        bookingId: payment.bookingId,
        userId: payment.userId,
        amount: new Prisma.Decimal(payment.amount.amount),
        currency: payment.amount.currency,
        status: payment.status,
        provider: payment.provider,
        paymentIntentId: payment.paymentIntentId,
        refundId: payment.refundId,
        metadata: payment.metadata as Prisma.InputJsonValue,
      },
    });

    return toDomain(record);
  }

  async update(payment: Payment): Promise<Payment> {
    const record = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        amount: new Prisma.Decimal(payment.amount.amount),
        currency: payment.amount.currency,
        status: payment.status,
        provider: payment.provider,
        paymentIntentId: payment.paymentIntentId,
        refundId: payment.refundId,
        metadata: payment.metadata as Prisma.InputJsonValue,
      },
    });

    return toDomain(record);
  }
}
