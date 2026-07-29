import axios, { AxiosInstance } from 'axios';

import { Cleaner } from '../../domain/entities/Cleaner';
import { TimeSlot } from '../../domain/value-objects/TimeSlot';
import { config } from '../../config';
import { logger } from '../../shared/utils/logger';

interface OptimizeScheduleInput {
  serviceType: string;
  postalCode: string;
  slot: TimeSlot;
  cleaners: Cleaner[];
}

interface PredictDemandInput {
  postalCode: string;
  serviceType: string;
  horizonDays: number;
}

interface RecommendCleanerInput {
  serviceType: string;
  postalCode: string;
  cleaners: Cleaner[];
}

interface CalculateDynamicPriceInput {
  baseRate: number;
  hours: number;
  extrasCost: number;
  serviceType: string;
  postalCode: string;
  scheduledStart: Date;
  demandMultiplier: number;
}

export class AtlasAIService {
  private readonly client: AxiosInstance | null = config.atlasAI.apiUrl
    ? axios.create({
        baseURL: config.atlasAI.apiUrl,
        timeout: 3000,
        maxRedirects: 0,
        headers: config.atlasAI.apiKey ? { 'x-api-key': config.atlasAI.apiKey } : undefined,
      })
    : null;

  async optimizeSchedule(input: OptimizeScheduleInput): Promise<Array<{ cleanerId: string; score: number; reasons: string[] }>> {
    if (this.client) {
      try {
        const response = await this.client.post('/schedule/optimize', {
          serviceType: input.serviceType,
          postalCode: input.postalCode,
          start: input.slot.start.toISOString(),
          end: input.slot.end.toISOString(),
          cleaners: input.cleaners.map((cleaner) => ({
            id: cleaner.id,
            rating: cleaner.rating,
            completedJobs: cleaner.completedJobs,
            skills: cleaner.skills,
            serviceAreas: cleaner.serviceAreas,
            availability: cleaner.availability,
            backgroundChecked: cleaner.backgroundChecked,
          })),
        });

        return response.data.rankings;
      } catch (error) {
        logger.warn('Atlas AI optimize call failed; falling back to local heuristics', { error: (error as Error).message });
      }
    }

    return input.cleaners
      .map((cleaner) => {
        const skillBoost = cleaner.skills.some((skill) => skill.toLowerCase() === input.serviceType.toLowerCase()) ? 0.25 : 0;
        const areaBoost = cleaner.serviceAreas.includes(input.postalCode) ? 0.2 : 0;
        const experienceBoost = Math.min(cleaner.completedJobs / 200, 0.2);
        const ratingBoost = cleaner.rating / 5;
        const score = Number((skillBoost + areaBoost + experienceBoost + ratingBoost).toFixed(2));

        return {
          cleanerId: cleaner.id,
          score,
          reasons: [
            `rating:${cleaner.rating}`,
            skillBoost > 0 ? 'skill-match' : 'generalist',
            areaBoost > 0 ? 'local-service-area' : 'travel-required',
          ],
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  async predictDemand(input: PredictDemandInput) {
    const baseline = 0.6 + (input.serviceType.toLowerCase() === 'deep' ? 0.15 : 0.05);
    const demandScore = Number(Math.min(0.98, baseline + input.horizonDays / 100).toFixed(2));

    return {
      postalCode: input.postalCode,
      serviceType: input.serviceType,
      horizonDays: input.horizonDays,
      demandScore,
      recommendation: demandScore > 0.8 ? 'Increase cleaner availability and surge pricing thresholds.' : 'Capacity is healthy.',
    };
  }

  async recommendCleaner(input: RecommendCleanerInput) {
    const [best] = await this.optimizeSchedule({
      serviceType: input.serviceType,
      postalCode: input.postalCode,
      slot: new TimeSlot(new Date(), new Date(Date.now() + 60 * 60 * 1000)),
      cleaners: input.cleaners,
    });

    return best ?? null;
  }

  async calculateDynamicPrice(input: CalculateDynamicPriceInput) {
    if (this.client) {
      try {
        const response = await this.client.post('/pricing/dynamic', {
          ...input,
          scheduledStart: input.scheduledStart.toISOString(),
        });
        return response.data;
      } catch (error) {
        logger.warn('Atlas AI pricing call failed; falling back to local heuristics', { error: (error as Error).message });
      }
    }

    const rushHour = [7, 8, 17, 18, 19].includes(input.scheduledStart.getHours()) ? 1.12 : 1;
    const serviceMultiplier = input.serviceType.toLowerCase() === 'commercial' ? 1.25 : 1;
    const subtotal = input.baseRate * input.hours + input.extrasCost;
    const finalPrice = Number((subtotal * input.demandMultiplier * rushHour * serviceMultiplier).toFixed(2));

    return {
      currency: 'USD',
      baseRate: input.baseRate,
      hours: input.hours,
      extrasCost: input.extrasCost,
      finalPrice,
      pricingFactors: {
        demandMultiplier: input.demandMultiplier,
        rushHour,
        serviceMultiplier,
      },
    };
  }
}
