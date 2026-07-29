import { differenceInMinutes, isWeekend } from 'date-fns';

import { AddressProps } from '../../../domain/value-objects/Address';
import { AtlasAIService } from '../../../infrastructure/services/AtlasAIService';

export interface DynamicPricingInput {
  address: AddressProps;
  serviceType: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  extras: string[];
}

export class DynamicPricingUseCase {
  constructor(private readonly atlasAIService: AtlasAIService) {}

  async execute(input: DynamicPricingInput) {
    const durationMinutes = differenceInMinutes(input.scheduledEnd, input.scheduledStart);
    const baseRateByService: Record<string, number> = {
      standard: 80,
      deep: 140,
      moveout: 200,
      commercial: 250,
    };

    const baseRate = baseRateByService[input.serviceType.toLowerCase()] ?? 100;
    const hours = Math.max(durationMinutes / 60, 1);
    const extrasCost = input.extras.length * 15;
    const weekendMultiplier = isWeekend(input.scheduledStart) ? 1.15 : 1;

    return this.atlasAIService.calculateDynamicPrice({
      baseRate,
      hours,
      extrasCost,
      serviceType: input.serviceType,
      postalCode: input.address.postalCode,
      scheduledStart: input.scheduledStart,
      demandMultiplier: weekendMultiplier,
    });
  }
}
