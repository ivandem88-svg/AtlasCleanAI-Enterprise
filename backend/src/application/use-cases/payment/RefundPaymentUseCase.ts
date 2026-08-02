import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { StripeService } from '../../../infrastructure/services/StripeService';
import { NotFoundError } from '../../../shared/errors/HttpError';

export class RefundPaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly stripeService: StripeService,
  ) {}

  async execute(paymentId: string, reason: string) {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment || !payment.paymentIntentId) {
      throw new NotFoundError('Payment not found');
    }

    const refund = await this.stripeService.refundPayment(payment.paymentIntentId, reason);
    payment.markRefunded(refund.id);
    payment.metadata = { ...payment.metadata, refundReason: reason, refund };

    return this.paymentRepository.update(payment);
  }
}
