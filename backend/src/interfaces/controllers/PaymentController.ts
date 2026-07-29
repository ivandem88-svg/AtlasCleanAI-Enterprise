import { NextFunction, Request, Response } from 'express';

import { processPaymentSchema, refundPaymentSchema } from '../../application/dtos/PaymentDto';
import { ProcessPaymentUseCase } from '../../application/use-cases/payment/ProcessPaymentUseCase';
import { RefundPaymentUseCase } from '../../application/use-cases/payment/RefundPaymentUseCase';
import { validateSchema } from '../../shared/utils/validator';

export class PaymentController {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
  ) {}

  process = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = validateSchema(processPaymentSchema, request.body);
      const payment = await this.processPaymentUseCase.execute({ ...payload, currency: payload.currency ?? 'USD' });
      response.status(201).json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  };

  refund = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = validateSchema(refundPaymentSchema, request.body);
      const payment = await this.refundPaymentUseCase.execute(payload.paymentId, payload.reason);
      response.status(200).json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  };
}
