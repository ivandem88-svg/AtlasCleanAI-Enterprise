import { NextFunction, Response } from 'express';

import { cancelBookingSchema, createBookingSchema, updateBookingSchema } from '../../application/dtos/BookingDto';
import { CancelBookingUseCase } from '../../application/use-cases/booking/CancelBookingUseCase';
import { CreateBookingUseCase } from '../../application/use-cases/booking/CreateBookingUseCase';
import { GetBookingsUseCase } from '../../application/use-cases/booking/GetBookingsUseCase';
import { UpdateBookingUseCase } from '../../application/use-cases/booking/UpdateBookingUseCase';
import { UnauthorizedError } from '../../shared/errors/HttpError';
import { AuthenticatedRequest } from '../../shared/types';
import { validateSchema } from '../../shared/utils/validator';

export class BookingController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly updateBookingUseCase: UpdateBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
    private readonly getBookingsUseCase: GetBookingsUseCase,
  ) {}

  create = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const user = request.user;
      if (!user) throw new UnauthorizedError();

      const payload = validateSchema(createBookingSchema, request.body);
      const booking = await this.createBookingUseCase.execute({ ...payload, userId: user.id, extras: payload.extras ?? [] });
      response.status(201).json({ success: true, data: booking.toJSON() });
    } catch (error) {
      next(error);
    }
  };

  list = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const user = request.user;
      if (!user) throw new UnauthorizedError();

      const bookings = await this.getBookingsUseCase.execute(user.id, user.role);
      response.status(200).json({ success: true, data: bookings.map((booking) => booking.toJSON()) });
    } catch (error) {
      next(error);
    }
  };

  update = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      validateSchema(updateBookingSchema, request.body);
      const booking = await this.updateBookingUseCase.execute(request.params.bookingId, request.body);
      response.status(200).json({ success: true, data: booking.toJSON() });
    } catch (error) {
      next(error);
    }
  };

  cancel = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = validateSchema(cancelBookingSchema, request.body);
      const booking = await this.cancelBookingUseCase.execute(request.params.bookingId, payload.reason);
      response.status(200).json({ success: true, data: booking.toJSON() });
    } catch (error) {
      next(error);
    }
  };
}
