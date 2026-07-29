import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

import { config } from '../../config';
import { logger } from '../../shared/utils/logger';

export class FirebaseService {
  private readonly app: App | null;

  constructor() {
    if (!config.firebase.projectId || !config.firebase.clientEmail || !config.firebase.privateKey) {
      this.app = null;
      return;
    }

    this.app = getApps()[0] ?? initializeApp({
      credential: cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
    });
  }

  async sendPushNotification(token: string, title: string, body: string): Promise<void> {
    if (!this.app) {
      logger.info('Firebase not configured; skipping push notification', { token, title });
      return;
    }

    await getMessaging(this.app).send({
      token,
      notification: { title, body },
    });
  }
}
