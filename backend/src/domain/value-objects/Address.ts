export interface AddressProps {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  accessInstructions?: string;
}

export class Address {
  constructor(public readonly props: AddressProps) {
    if (!props.line1 || !props.city || !props.state || !props.postalCode || !props.country) {
      throw new Error('Address requires line1, city, state, postalCode, and country');
    }
  }

  get line1(): string {
    return this.props.line1;
  }

  get postalCode(): string {
    return this.props.postalCode;
  }

  toSingleLine(): string {
    return [this.props.line1, this.props.line2, this.props.city, this.props.state, this.props.postalCode, this.props.country]
      .filter(Boolean)
      .join(', ');
  }

  toJSON() {
    return this.props;
  }
}
