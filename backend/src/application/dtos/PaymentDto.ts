import { z } from 'zod';

export const processPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  paymentMethodId: z.string().min(3),
});

export const refundPaymentSchema = z.object({
  paymentId: z.string().uuid(),
  reason: z.string().min(3).max(500),
});

export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>;
