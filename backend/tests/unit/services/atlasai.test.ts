import { Cleaner } from '../../../src/domain/entities/Cleaner';
import { TimeSlot } from '../../../src/domain/value-objects/TimeSlot';
import { AtlasAIService } from '../../../src/infrastructure/services/AtlasAIService';

describe('AtlasAIService', () => {
  it('ranks cleaners using fallback heuristics', async () => {
    const service = new AtlasAIService();
    const slot = new TimeSlot(new Date(Date.now() + 60_000), new Date(Date.now() + 3_600_000));
    const cleaners = [
      new Cleaner({
        id: '1f58f7d7-e4ff-4cba-bb24-0db0566a3093',
        firstName: 'Top',
        lastName: 'Performer',
        email: 'top@example.com',
        rating: 5,
        completedJobs: 200,
        skills: ['deep'],
        serviceAreas: ['10001'],
        availability: [{ dayOfWeek: slot.start.getUTCDay(), startHour: 0, endHour: 23 }],
        vehicleAvailable: true,
        backgroundChecked: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    const result = await service.optimizeSchedule({
      serviceType: 'deep',
      postalCode: '10001',
      slot,
      cleaners,
    });

    expect(result[0].cleanerId).toBe(cleaners[0].id);
    expect(result[0].score).toBeGreaterThan(1);
  });
});
