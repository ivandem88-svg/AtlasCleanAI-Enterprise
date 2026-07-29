import { NextFunction, Request, Response } from 'express';

import { CleanerRecommendationUseCase } from '../../application/use-cases/ai/CleanerRecommendationUseCase';
import { DemandPredictionUseCase } from '../../application/use-cases/ai/DemandPredictionUseCase';
import { DynamicPricingUseCase } from '../../application/use-cases/ai/DynamicPricingUseCase';
import { SmartSchedulingUseCase } from '../../application/use-cases/ai/SmartSchedulingUseCase';
import { ValidationError } from '../../shared/errors/HttpError';

export class AIController {
  constructor(
    private readonly demandPredictionUseCase: DemandPredictionUseCase,
    private readonly dynamicPricingUseCase: DynamicPricingUseCase,
    private readonly smartSchedulingUseCase: SmartSchedulingUseCase,
    private readonly cleanerRecommendationUseCase: CleanerRecommendationUseCase,
  ) {}

  predictDemand = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const { postalCode, serviceType, horizonDays } = request.query;
      if (!postalCode || !serviceType) {
        throw new ValidationError('postalCode and serviceType are required');
      }

      const forecast = await this.demandPredictionUseCase.execute(
        String(postalCode),
        String(serviceType),
        horizonDays ? Number(horizonDays) : 7,
      );

      response.status(200).json({ success: true, data: forecast });
    } catch (error) {
      next(error);
    }
  };

  dynamicPricing = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const { address, serviceType, scheduledStart, scheduledEnd, extras = [] } = request.body;
      if (!address || !serviceType || !scheduledStart || !scheduledEnd) {
        throw new ValidationError('address, serviceType, scheduledStart, and scheduledEnd are required');
      }

      const pricing = await this.dynamicPricingUseCase.execute({
        address,
        serviceType,
        scheduledStart: new Date(scheduledStart),
        scheduledEnd: new Date(scheduledEnd),
        extras,
      });
      response.status(200).json({ success: true, data: pricing });
    } catch (error) {
      next(error);
    }
  };

  smartScheduling = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const { postalCode, serviceType, start, end } = request.body;
      if (!postalCode || !serviceType || !start || !end) {
        throw new ValidationError('postalCode, serviceType, start, and end are required');
      }

      const recommendation = await this.smartSchedulingUseCase.execute({
        postalCode,
        serviceType,
        start: new Date(start),
        end: new Date(end),
      });
      response.status(200).json({ success: true, data: recommendation });
    } catch (error) {
      next(error);
    }
  };

  recommendCleaner = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const { postalCode, serviceType, start, end } = request.body;
      if (!postalCode || !serviceType || !start || !end) {
        throw new ValidationError('postalCode, serviceType, start, and end are required');
      }

      const recommendation = await this.cleanerRecommendationUseCase.execute(
        serviceType,
        postalCode,
        new Date(start),
        new Date(end),
      );
      response.status(200).json({ success: true, data: recommendation });
    } catch (error) {
      next(error);
    }
  };
}
