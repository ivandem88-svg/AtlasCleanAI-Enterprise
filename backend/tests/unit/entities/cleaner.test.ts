import { Cleaner, CleanerAvailability } from '../../../src/domain/entities/Cleaner';
import { TimeSlot } from '../../../src/domain/value-objects/TimeSlot';

const buildCleaner = (availability: CleanerAvailability[]): Cleaner =>
  new Cleaner({
    id: '38193f1e-e79a-4d0b-9f0e-40876dcd3a5d',
    firstName: 'Ready',
    lastName: 'Cleaner',
    email: 'cleaner@example.com',
    rating: 4.8,
    completedJobs: 75,
    skills: ['standard'],
    serviceAreas: ['94107'],
    availability,
    vehicleAvailable: true,
    backgroundChecked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

const slot = (start: string, end: string): TimeSlot => new TimeSlot(new Date(start), new Date(end));

describe('Cleaner.isAvailable', () => {
  // 2030-01-07 is a Monday.
  const monday = buildCleaner([{ dayOfWeek: 1, startHour: 9, endHour: 10 }]);

  it('accepts a slot inside the window', () => {
    expect(monday.isAvailable(slot('2030-01-07T09:15:00Z', '2030-01-07T09:45:00Z'))).toBe(true);
  });

  it('accepts a slot that exactly matches the window', () => {
    expect(monday.isAvailable(slot('2030-01-07T09:00:00Z', '2030-01-07T10:00:00Z'))).toBe(true);
  });

  it('rejects a slot that ends after the window closes within the same hour', () => {
    expect(monday.isAvailable(slot('2030-01-07T09:30:00Z', '2030-01-07T10:30:00Z'))).toBe(false);
  });

  it('rejects a slot that starts before the window opens', () => {
    expect(monday.isAvailable(slot('2030-01-07T08:30:00Z', '2030-01-07T09:30:00Z'))).toBe(false);
  });

  it('rejects a slot on another weekday', () => {
    expect(monday.isAvailable(slot('2030-01-08T09:00:00Z', '2030-01-08T10:00:00Z'))).toBe(false);
  });

  it('rejects a slot that rolls over midnight even when the hours fit the window', () => {
    const allDay = buildCleaner([{ dayOfWeek: 1, startHour: 0, endHour: 24 }]);

    expect(allDay.isAvailable(slot('2030-01-07T22:00:00Z', '2030-01-08T02:00:00Z'))).toBe(false);
  });

  it('rejects a slot that spans several days even when the hours fit the window', () => {
    const allDay = buildCleaner([{ dayOfWeek: 1, startHour: 0, endHour: 24 }]);

    expect(allDay.isAvailable(slot('2030-01-07T09:00:00Z', '2030-01-09T10:00:00Z'))).toBe(false);
  });

  it('accepts a slot that ends exactly at midnight when the window runs to hour 24', () => {
    const allDay = buildCleaner([{ dayOfWeek: 1, startHour: 0, endHour: 24 }]);

    expect(allDay.isAvailable(slot('2030-01-07T22:00:00Z', '2030-01-08T00:00:00Z'))).toBe(true);
  });
});
