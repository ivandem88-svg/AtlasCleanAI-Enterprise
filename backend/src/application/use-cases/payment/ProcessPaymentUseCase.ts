import { v4 as uuidv4 } from 'uuid';

import { Payment } from '../../../domain/entities/Payment';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { StripeService } from '../../../infrastructure/services/StripeService';
import { NotFoundError } from '../../../shared/errors/HttpError';
import { ProcessPaymentInput } from '../../dtos/PaymentDto';

export class ProcessPaymentUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly paymentRepository: IPaymentRepository,
    private readonly stripeService: StripeService,
  ) {}

  async execute(input: ProcessPaymentInput) {
    const booking = await this.bookingRepository.findById(input.bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    const paymentIntent = await this.stripeService.createPaymentIntent({
      amount: input.amount,
      currency: input.currency,
      paymentMethodId: input.paymentMethodId,
      metadata: { bookingId: input.bookingId, userId: input.userId },
    });

    const payment = new Payment({
      id: uuidv4(),
      bookingId: input.bookingId,
      userId: input.userId,
      amount: input.amount,
      currency: input.currency,
      status: 'AUTHORIZED',
      provider: 'STRIPE',
      paymentIntentId: paymentIntent.id,
      metadata: paymentIntent,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.paymentRepository.create(payment);
  }
}
