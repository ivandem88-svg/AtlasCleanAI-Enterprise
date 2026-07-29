import { RequestHandler, Router } from 'express';

import { PaymentController } from '../../controllers/PaymentController';

export const createPaymentRoutes = (paymentController: PaymentController, authMiddleware: RequestHandler): Router => {
  const router = Router();
  router.use(authMiddleware);
  router.post('/process', paymentController.process);
  router.post('/refund', paymentController.refund);
  return router;
};
