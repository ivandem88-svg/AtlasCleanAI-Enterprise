import { Address, AddressProps } from '../value-objects/Address';
import { UserRole, UserStatus } from '../../shared/types';

export interface UserPreferences {
  marketingOptIn: boolean;
  preferredLanguage: string;
  smsNotifications: boolean;
  emailNotifications: boolean;
}

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  address?: AddressProps;
  refreshTokenVersion: number;
  emailVerified: boolean;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  public readonly id: string;
  public email: string;
  public passwordHash: string;
  public firstName: string;
  public lastName: string;
  public phone?: string;
  public role: UserRole;
  public status: UserStatus;
  public address?: Address;
  public refreshTokenVersion: number;
  public emailVerified: boolean;
  public preferences: UserPreferences;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email.trim().toLowerCase();
    this.passwordHash = props.passwordHash;
    this.firstName = props.firstName.trim();
    this.lastName = props.lastName.trim();
    this.phone = props.phone;
    this.role = props.role;
    this.status = props.status;
    this.address = props.address ? new Address(props.address) : undefined;
    this.refreshTokenVersion = props.refreshTokenVersion;
    this.emailVerified = props.emailVerified;
    this.preferences = props.preferences;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  markEmailVerified(): void {
    this.emailVerified = true;
    this.status = 'ACTIVE';
    this.touch();
  }

  bumpRefreshTokenVersion(): void {
    this.refreshTokenVersion += 1;
    this.touch();
  }

  updateProfile(data: Partial<Pick<UserProps, 'firstName' | 'lastName' | 'phone' | 'preferences' | 'address'>>): void {
    if (data.firstName) this.firstName = data.firstName.trim();
    if (data.lastName) this.lastName = data.lastName.trim();
    if (data.phone) this.phone = data.phone;
    if (data.preferences) this.preferences = { ...this.preferences, ...data.preferences };
    if (data.address) this.address = new Address(data.address);
    this.touch();
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      phone: this.phone,
      role: this.role,
      status: this.status,
      address: this.address?.toJSON(),
      refreshTokenVersion: this.refreshTokenVersion,
      emailVerified: this.emailVerified,
      preferences: this.preferences,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
