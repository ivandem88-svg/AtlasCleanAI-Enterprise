import { RequestHandler, Router } from 'express';

import { BookingController } from '../../controllers/BookingController';

export const createBookingRoutes = (bookingController: BookingController, authMiddleware: RequestHandler): Router => {
  const router = Router();

  router.use(authMiddleware);
  router.get('/', bookingController.list);
  router.post('/', bookingController.create);
  router.patch('/:bookingId', bookingController.update);
  router.post('/:bookingId/cancel', bookingController.cancel);

  return router;
};
