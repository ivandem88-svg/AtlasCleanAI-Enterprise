import { ICleanerRepository } from '../../../domain/repositories/ICleanerRepository';
import { TimeSlot } from '../../../domain/value-objects/TimeSlot';
import { AtlasAIService } from '../../../infrastructure/services/AtlasAIService';

export class CleanerRecommendationUseCase {
  constructor(
    private readonly cleanerRepository: ICleanerRepository,
    private readonly atlasAIService: AtlasAIService,
  ) {}

  async execute(serviceType: string, postalCode: string, start: Date, end: Date) {
    const cleaners = await this.cleanerRepository.findAvailable(new TimeSlot(start, end), postalCode);

    return this.atlasAIService.recommendCleaner({ serviceType, postalCode, cleaners });
  }
}
