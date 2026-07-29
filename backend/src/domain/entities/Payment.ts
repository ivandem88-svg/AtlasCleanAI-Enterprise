import { Money } from '../value-objects/Money';
import { PaymentProvider, PaymentStatus } from '../../shared/types';

export interface PaymentProps {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  paymentIntentId?: string;
  refundId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment {
  public readonly id: string;
  public readonly bookingId: string;
  public readonly userId: string;
  public amount: Money;
  public status: PaymentStatus;
  public provider: PaymentProvider;
  public paymentIntentId?: string;
  public refundId?: string;
  public metadata?: Record<string, unknown>;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: PaymentProps) {
    this.id = props.id;
    this.bookingId = props.bookingId;
    this.userId = props.userId;
    this.amount = new Money(props.amount, props.currency);
    this.status = props.status;
    this.provider = props.provider;
    this.paymentIntentId = props.paymentIntentId;
    this.refundId = props.refundId;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  markSucceeded(paymentIntentId: string): void {
    this.status = 'SUCCEEDED';
    this.paymentIntentId = paymentIntentId;
    this.touch();
  }

  markRefunded(refundId: string): void {
    this.status = 'REFUNDED';
    this.refundId = refundId;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
