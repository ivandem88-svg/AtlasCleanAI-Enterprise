import { logger } from '../../shared/utils/logger';

export class SmsService {
  async sendSms(phone: string, message: string): Promise<void> {
    logger.info('SMS dispatched', { phone, messageLength: message.length });
  }
}
