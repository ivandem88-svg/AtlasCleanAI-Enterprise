import { TimeSlot } from '../value-objects/TimeSlot';

const MS_PER_HOUR = 60 * 60 * 1000;

export interface CleanerAvailability {
  dayOfWeek: number;
  startHour: number;
  endHour: number;
}

export interface CleanerProps {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  rating: number;
  completedJobs: number;
  skills: string[];
  serviceAreas: string[];
  availability: CleanerAvailability[];
  vehicleAvailable: boolean;
  backgroundChecked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Cleaner {
  public readonly id: string;
  public readonly userId?: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public phone?: string;
  public rating: number;
  public completedJobs: number;
  public skills: string[];
  public serviceAreas: string[];
  public availability: CleanerAvailability[];
  public vehicleAvailable: boolean;
  public backgroundChecked: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: CleanerProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email.toLowerCase();
    this.phone = props.phone;
    this.rating = props.rating;
    this.completedJobs = props.completedJobs;
    this.skills = props.skills;
    this.serviceAreas = props.serviceAreas;
    this.availability = props.availability;
    this.vehicleAvailable = props.vehicleAvailable;
    this.backgroundChecked = props.backgroundChecked;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isAvailable(slot: TimeSlot): boolean {
    const weekday = slot.start.getUTCDay();
    const dayStart = Date.UTC(slot.start.getUTCFullYear(), slot.start.getUTCMonth(), slot.start.getUTCDate());

    return this.availability.some(
      (window) =>
        window.dayOfWeek === weekday &&
        slot.start.getTime() >= dayStart + window.startHour * MS_PER_HOUR &&
        slot.end.getTime() <= dayStart + window.endHour * MS_PER_HOUR,
    );
  }
}
