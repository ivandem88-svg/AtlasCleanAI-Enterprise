import { AtlasAIService } from '../../../infrastructure/services/AtlasAIService';

export class DemandPredictionUseCase {
  constructor(private readonly atlasAIService: AtlasAIService) {}

  async execute(postalCode: string, serviceType: string, horizonDays = 7) {
    return this.atlasAIService.predictDemand({ postalCode, serviceType, horizonDays });
  }
}
