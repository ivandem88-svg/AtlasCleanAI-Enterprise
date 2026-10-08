import nodemailer from 'nodemailer';

import { config } from '../../config';
import { logger } from '../../shared/utils/logger';

export class EmailService {
  private readonly transporter = nodemailer.createTransport(
    (config.smtp.host
      ? {
          host: config.smtp.host,
          port: config.smtp.port,
          secure: config.smtp.port === 465,
          auth: config.smtp.user && config.smtp.pass ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
        }
      : { jsonTransport: true }) as unknown as nodemailer.TransportOptions,
  );

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'Welcome to AtlasCleanAI Enterprise',
      html: `<p>Hi ${name},</p><p>Your AtlasCleanAI account is ready. Book, manage, and optimize cleaning services in one place.</p>`,
    });
  }

  async sendBookingConfirmation(email: string, bookingId: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'Booking confirmed',
      html: `<p>Your booking <strong>${bookingId}</strong> has been confirmed.</p>`,
    });
  }

  async sendMail(message: { to: string; subject: string; html: string }): Promise<void> {
    const response = await this.transporter.sendMail({
      from: config.smtp.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
    });

    logger.info('Email dispatched', { to: message.to, messageId: response.messageId });
  }
}
