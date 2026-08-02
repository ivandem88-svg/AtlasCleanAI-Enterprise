import { Address, AddressProps } from '../value-objects/Address';
import { Money } from '../value-objects/Money';
import { TimeSlot } from '../value-objects/TimeSlot';
import { BookingStatus } from '../../shared/types';

export interface BookingProps {
  id: string;
  userId: string;
  cleanerId?: string;
  serviceId?: string;
  serviceType: string;
  address: AddressProps;
  timeSlot: { start: Date; end: Date };
  durationMinutes: number;
  amount: number;
  currency: string;
  status: BookingStatus;
  notes?: string;
  extras: string[];
  aiMetadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class Booking {
  public readonly id: string;
  public userId: string;
  public cleanerId?: string;
  public serviceId?: string;
  public serviceType: string;
  public address: Address;
  public timeSlot: TimeSlot;
  public durationMinutes: number;
  public amount: Money;
  public status: BookingStatus;
  public notes?: string;
  public extras: string[];
  public aiMetadata?: Record<string, unknown>;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: BookingProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.cleanerId = props.cleanerId;
    this.serviceId = props.serviceId;
    this.serviceType = props.serviceType;
    this.address = new Address(props.address);
    this.timeSlot = new TimeSlot(props.timeSlot.start, props.timeSlot.end);
    this.durationMinutes = props.durationMinutes;
    this.amount = new Money(props.amount, props.currency);
    this.status = props.status;
    this.notes = props.notes;
    this.extras = props.extras;
    this.aiMetadata = props.aiMetadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  assignCleaner(cleanerId: string): void {
    this.cleanerId = cleanerId;
    this.status = 'ASSIGNED';
    this.touch();
  }

  confirm(): void {
    this.status = 'CONFIRMED';
    this.touch();
  }

  cancel(reason?: string): void {
    if (this.status === 'COMPLETED') {
      throw new Error('Completed bookings cannot be cancelled');
    }
    this.status = 'CANCELLED';
    this.aiMetadata = { ...this.aiMetadata, cancellationReason: reason };
    this.touch();
  }

  updateSchedule(start: Date, end: Date): void {
    this.timeSlot = new TimeSlot(start, end);
    this.durationMinutes = this.timeSlot.durationInMinutes();
    this.touch();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      cleanerId: this.cleanerId,
      serviceId: this.serviceId,
      serviceType: this.serviceType,
      address: this.address.toJSON(),
      timeSlot: this.timeSlot.toJSON(),
      durationMinutes: this.durationMinutes,
      amount: this.amount.toJSON(),
      status: this.status,
      notes: this.notes,
      extras: this.extras,
      aiMetadata: this.aiMetadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
