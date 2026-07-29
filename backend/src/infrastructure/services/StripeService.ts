import { randomUUID } from 'crypto';

import Stripe from 'stripe';

import { config } from '../../config';

export interface CreatePaymentIntentInput {
  amount: number;
  currency: string;
  paymentMethodId: string;
  metadata?: Record<string, string>;
}

export class StripeService {
  private readonly stripe = config.stripe.secretKey
    ? new Stripe(config.stripe.secretKey, { apiVersion: '2022-11-15' })
    : null;

  async createPaymentIntent(input: CreatePaymentIntentInput) {
    if (!this.stripe) {
      return {
        id: `pi_mock_${randomUUID()}`,
        clientSecret: `pi_secret_${randomUUID()}`,
        amount: Math.round(input.amount * 100),
        currency: input.currency.toLowerCase(),
        status: 'requires_capture',
      };
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(input.amount * 100),
      currency: input.currency.toLowerCase(),
      payment_method: input.paymentMethodId,
      confirm: true,
      capture_method: 'manual',
      metadata: input.metadata,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
    });

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };
  }

  async refundPayment(paymentIntentId: string, reason: string) {
    if (!this.stripe) {
      return { id: `re_mock_${randomUUID()}`, paymentIntentId, reason, status: 'succeeded' };
    }

    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer',
      metadata: { reason },
    });

    return { id: refund.id, paymentIntentId, reason, status: refund.status };
  }
}
