import { RequestHandler, Router } from 'express';

import { EmailService } from '../../../infrastructure/services/EmailService';
import { FirebaseService } from '../../../infrastructure/services/FirebaseService';
import { SmsService } from '../../../infrastructure/services/SmsService';

export const createNotificationRoutes = (
  emailService: EmailService,
  smsService: SmsService,
  firebaseService: FirebaseService,
  authMiddleware: RequestHandler,
): Router => {
  const router = Router();

  router.use(authMiddleware);
  router.post('/preview', async (request, response, next) => {
    try {
      const { email, phone, deviceToken } = request.body;
      if (email) {
        await emailService.sendMail({
          to: email,
          subject: 'AtlasCleanAI notification preview',
          html: '<p>This is a preview notification.</p>',
        });
      }
      if (phone) {
        await smsService.sendSms(phone, 'AtlasCleanAI notification preview');
      }
      if (deviceToken) {
        await firebaseService.sendPushNotification(deviceToken, 'AtlasCleanAI', 'Notification preview');
      }
      response.status(200).json({ success: true, data: { delivered: true } });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
