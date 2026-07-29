export class TimeSlot {
  public readonly start: Date;
  public readonly end: Date;

  constructor(start: Date, end: Date) {
    if (end <= start) {
      throw new Error('Time slot end must be after start');
    }

    this.start = start;
    this.end = end;
  }

  overlaps(other: TimeSlot): boolean {
    return this.start < other.end && other.start < this.end;
  }

  durationInMinutes(): number {
    return Math.round((this.end.getTime() - this.start.getTime()) / (1000 * 60));
  }

  toJSON() {
    return { start: this.start.toISOString(), end: this.end.toISOString() };
  }
}
