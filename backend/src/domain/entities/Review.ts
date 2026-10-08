export interface ReviewProps {
  id: string;
  bookingId: string;
  userId: string;
  cleanerId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Review {
  public readonly id: string;
  public readonly bookingId: string;
  public readonly userId: string;
  public readonly cleanerId: string;
  public rating: number;
  public comment?: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: ReviewProps) {
    if (props.rating < 1 || props.rating > 5) {
      throw new Error('Review rating must be between 1 and 5');
    }

    this.id = props.id;
    this.bookingId = props.bookingId;
    this.userId = props.userId;
    this.cleanerId = props.cleanerId;
    this.rating = props.rating;
    this.comment = props.comment;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
