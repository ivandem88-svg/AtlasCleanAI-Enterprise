export class Money {
  public readonly amount: number;
  public readonly currency: string;

  constructor(amount: number, currency = 'USD') {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error('Money amount must be a non-negative number');
    }

    this.amount = Number(amount.toFixed(2));
    this.currency = currency.toUpperCase();
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(multiplier: number): Money {
    if (!Number.isFinite(multiplier) || multiplier < 0) {
      throw new Error('Multiplier must be a non-negative number');
    }

    return new Money(this.amount * multiplier, this.currency);
  }

  toMinorUnit(): number {
    return Math.round(this.amount * 100);
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error('Currency mismatch');
    }
  }

  toJSON() {
    return { amount: this.amount, currency: this.currency };
  }
}
