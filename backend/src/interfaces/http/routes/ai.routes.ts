import { RequestHandler, Router } from 'express';

import { AIController } from '../../controllers/AIController';

export const createAIRoutes = (aiController: AIController, authMiddleware: RequestHandler): Router => {
  const router = Router();
  router.use(authMiddleware);
  router.get('/demand', aiController.predictDemand);
  router.post('/pricing', aiController.dynamicPricing);
  router.post('/schedule', aiController.smartScheduling);
  router.post('/recommend-cleaner', aiController.recommendCleaner);
  return router;
};
