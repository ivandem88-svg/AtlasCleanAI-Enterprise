import compression from 'compression';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config';
import { Booking } from './domain/entities/Booking';
import { Cleaner } from './domain/entities/Cleaner';
import { ICleanerRepository } from './domain/repositories/ICleanerRepository';
import { TimeSlot } from './domain/value-objects/TimeSlot';
import { CleanerRecommendationUseCase } from './application/use-cases/ai/CleanerRecommendationUseCase';
import { DemandPredictionUseCase } from './application/use-cases/ai/DemandPredictionUseCase';
import { DynamicPricingUseCase } from './application/use-cases/ai/DynamicPricingUseCase';
import { SmartSchedulingUseCase } from './application/use-cases/ai/SmartSchedulingUseCase';
import { LoginUseCase } from './application/use-cases/auth/LoginUseCase';
import { RefreshTokenUseCase } from './application/use-cases/auth/RefreshTokenUseCase';
import { RegisterUseCase } from './application/use-cases/auth/RegisterUseCase';
import { CancelBookingUseCase } from './application/use-cases/booking/CancelBookingUseCase';
import { CreateBookingUseCase } from './application/use-cases/booking/CreateBookingUseCase';
import { GetBookingsUseCase } from './application/use-cases/booking/GetBookingsUseCase';
import { UpdateBookingUseCase } from './application/use-cases/booking/UpdateBookingUseCase';
import { ProcessPaymentUseCase } from './application/use-cases/payment/ProcessPaymentUseCase';
import { RefundPaymentUseCase } from './application/use-cases/payment/RefundPaymentUseCase';
import { UserRepository } from './infrastructure/database/repositories/UserRepository';
import { BookingRepository } from './infrastructure/database/repositories/BookingRepository';
import { PaymentRepository } from './infrastructure/database/repositories/PaymentRepository';
import { AtlasAIService } from './infrastructure/services/AtlasAIService';
import { EmailService } from './infrastructure/services/EmailService';
import { FirebaseService } from './infrastructure/services/FirebaseService';
import { JwtService } from './infrastructure/services/JwtService';
import { SmsService } from './infrastructure/services/SmsService';
import { StripeService } from './infrastructure/services/StripeService';
import { AIController } from './interfaces/controllers/AIController';
import { AuthController } from './interfaces/controllers/AuthController';
import { BookingController } from './interfaces/controllers/BookingController';
import { CleanerController } from './interfaces/controllers/CleanerController';
import { PaymentController } from './interfaces/controllers/PaymentController';
import { errorHandler } from './interfaces/http/middleware/errorHandler.middleware';
import { apiRateLimiter } from './interfaces/http/middleware/rateLimiter.middleware';
import { createAuthMiddleware } from './interfaces/http/middleware/auth.middleware';
import { createAIRoutes } from './interfaces/http/routes/ai.routes';
import { createAuthRoutes } from './interfaces/http/routes/auth.routes';
import { createBookingRoutes } from './interfaces/http/routes/booking.routes';
import { createCleanerRoutes } from './interfaces/http/routes/cleaner.routes';
import { createNotificationRoutes } from './interfaces/http/routes/notification.routes';
import { createPaymentRoutes } from './interfaces/http/routes/payment.routes';

class StaticCleanerRepository implements ICleanerRepository {
  private readonly cleaners: Cleaner[] = [
    new Cleaner({
      id: '00000000-0000-0000-0000-000000000101',
      firstName: 'Maya',
      lastName: 'Santos',
      email: 'maya.santos@atlasclean.ai',
      rating: 4.9,
      completedJobs: 243,
      skills: ['standard', 'deep', 'moveout'],
      serviceAreas: ['94107', '94110', '94158'],
      availability: [
        { dayOfWeek: 1, startHour: 8, endHour: 18 },
        { dayOfWeek: 2, startHour: 8, endHour: 18 },
        { dayOfWeek: 3, startHour: 8, endHour: 18 },
        { dayOfWeek: 4, startHour: 8, endHour: 18 },
        { dayOfWeek: 5, startHour: 8, endHour: 18 },
      ],
      vehicleAvailable: true,
      backgroundChecked: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Cleaner({
      id: '00000000-0000-0000-0000-000000000102',
      firstName: 'Aiden',
      lastName: 'Brooks',
      email: 'aiden.brooks@atlasclean.ai',
      rating: 4.7,
      completedJobs: 188,
      skills: ['standard', 'commercial'],
      serviceAreas: ['94107', '94016'],
      availability: [
        { dayOfWeek: 1, startHour: 6, endHour: 16 },
        { dayOfWeek: 2, startHour: 6, endHour: 16 },
        { dayOfWeek: 3, startHour: 6, endHour: 16 },
        { dayOfWeek: 4, startHour: 6, endHour: 16 },
        { dayOfWeek: 5, startHour: 6, endHour: 16 },
      ],
      vehicleAvailable: true,
      backgroundChecked: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  async findById(id: string) {
    return this.cleaners.find((cleaner) => cleaner.id === id) ?? null;
  }

  async findAll() {
    return this.cleaners;
  }

  async findAvailable(slot: TimeSlot, postalCode?: string) {
    return this.cleaners.filter(
      (cleaner) => cleaner.isAvailable(slot) && (!postalCode || cleaner.serviceAreas.includes(postalCode)),
    );
  }
}

export interface AppDependencies {
  userRepository: UserRepository;
  bookingRepository: BookingRepository;
  paymentRepository: PaymentRepository;
  cleanerRepository: ICleanerRepository;
  jwtService: JwtService;
  emailService: EmailService;
  smsService: SmsService;
  firebaseService: FirebaseService;
  stripeService: StripeService;
  atlasAIService: AtlasAIService;
}

const buildDependencies = (overrides: Partial<AppDependencies> = {}): AppDependencies => ({
  userRepository: overrides.userRepository ?? new UserRepository(),
  bookingRepository: overrides.bookingRepository ?? new BookingRepository(),
  paymentRepository: overrides.paymentRepository ?? new PaymentRepository(),
  cleanerRepository: overrides.cleanerRepository ?? new StaticCleanerRepository(),
  jwtService: overrides.jwtService ?? new JwtService(),
  emailService: overrides.emailService ?? new EmailService(),
  smsService: overrides.smsService ?? new SmsService(),
  firebaseService: overrides.firebaseService ?? new FirebaseService(),
  stripeService: overrides.stripeService ?? new StripeService(),
  atlasAIService: overrides.atlasAIService ?? new AtlasAIService(),
});

export const createApp = (overrides: Partial<AppDependencies> = {}): Express => {
  const dependencies = buildDependencies(overrides);

  const dynamicPricingUseCase = new DynamicPricingUseCase(dependencies.atlasAIService);
  const smartSchedulingUseCase = new SmartSchedulingUseCase(
    dependencies.cleanerRepository,
    dependencies.bookingRepository,
    dependencies.atlasAIService,
  );
  const cleanerRecommendationUseCase = new CleanerRecommendationUseCase(
    dependencies.cleanerRepository,
    dependencies.atlasAIService,
  );

  const authController = new AuthController(
    new RegisterUseCase(dependencies.userRepository, dependencies.jwtService, dependencies.emailService),
    new LoginUseCase(dependencies.userRepository, dependencies.jwtService),
    new RefreshTokenUseCase(dependencies.userRepository, dependencies.jwtService),
  );

  const bookingController = new BookingController(
    new CreateBookingUseCase(
      dependencies.bookingRepository,
      dependencies.userRepository,
      dynamicPricingUseCase,
      smartSchedulingUseCase,
    ),
    new UpdateBookingUseCase(dependencies.bookingRepository),
    new CancelBookingUseCase(dependencies.bookingRepository),
    new GetBookingsUseCase(dependencies.bookingRepository),
  );

  const paymentController = new PaymentController(
    new ProcessPaymentUseCase(dependencies.bookingRepository, dependencies.paymentRepository, dependencies.stripeService),
    new RefundPaymentUseCase(dependencies.paymentRepository, dependencies.stripeService),
  );

  const aiController = new AIController(
    new DemandPredictionUseCase(dependencies.atlasAIService),
    dynamicPricingUseCase,
    smartSchedulingUseCase,
    cleanerRecommendationUseCase,
  );

  const cleanerController = new CleanerController(dependencies.cleanerRepository);
  const authMiddleware = createAuthMiddleware(dependencies.jwtService) as RequestHandler;

  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: config.clientUrl,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
  app.use(apiRateLimiter);

  app.get('/health', (_request, response) => {
    response.status(200).json({
      success: true,
      data: {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    });
  });

  app.use(`${config.apiPrefix}/auth`, createAuthRoutes(authController));
  app.use(`${config.apiPrefix}/bookings`, createBookingRoutes(bookingController, authMiddleware));
  app.use(`${config.apiPrefix}/cleaners`, createCleanerRoutes(cleanerController));
  app.use(`${config.apiPrefix}/payments`, createPaymentRoutes(paymentController, authMiddleware));
  app.use(
    `${config.apiPrefix}/notifications`,
    createNotificationRoutes(dependencies.emailService, dependencies.smsService, dependencies.firebaseService, authMiddleware),
  );
  app.use(`${config.apiPrefix}/ai`, createAIRoutes(aiController, authMiddleware));

  app.use((_request, response) => {
    response.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
  });

  app.use(errorHandler);

  return app;
};
