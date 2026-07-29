import { Router } from 'express';

import { CleanerController } from '../../controllers/CleanerController';

export const createCleanerRoutes = (cleanerController: CleanerController): Router => {
  const router = Router();
  router.get('/', cleanerController.list);
  return router;
};
