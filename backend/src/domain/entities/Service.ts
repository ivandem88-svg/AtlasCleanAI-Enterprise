import { Money } from '../value-objects/Money';

export interface ServiceProps {
  id: string;
  name: string;
  description: string;
  category: string;
  durationMinutes: number;
  basePrice: number;
  currency: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Service {
  public readonly id: string;
  public name: string;
  public description: string;
  public category: string;
  public durationMinutes: number;
  public basePrice: Money;
  public active: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: ServiceProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.durationMinutes = props.durationMinutes;
    this.basePrice = new Money(props.basePrice, props.currency);
    this.active = props.active;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
