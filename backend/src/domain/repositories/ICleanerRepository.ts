import { Cleaner } from '../entities/Cleaner';
import { TimeSlot } from '../value-objects/TimeSlot';

export interface ICleanerRepository {
  findById(id: string): Promise<Cleaner | null>;
  findAll(): Promise<Cleaner[]>;
  findAvailable(slot: TimeSlot, postalCode?: string): Promise<Cleaner[]>;
}
