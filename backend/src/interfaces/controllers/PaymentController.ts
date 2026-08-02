import { NextFunction, Request, Response } from 'express';

import { processPaymentSchema, refundPaymentSchema } from '../../application/dtos/PaymentDto';
import { ProcessPaymentUseCase } from '../../application/use-cases/payment/ProcessPaymentUseCase';
import { RefundPaymentUseCase } from '../../application/use-cases/payment/RefundPaymentUseCase';
import { UnauthorizedError } from '../../shared/errors/HttpError';
import { AuthenticatedRequest } from '../../shared/types';
import { validateSchema } from '../../shared/utils/validator';

export class PaymentController {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
  ) {}

  process = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const user = request.user;
      if (!user) throw new UnauthorizedError();

      const payload = validateSchema(processPaymentSchema, request.body);
      const payment = await this.processPaymentUseCase.execute({
        ...payload,
        userId: user.id,
        currency: payload.currency ?? 'USD',
      });
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
