import { z } from 'zod';

export const bookingAddressSchema = z.object({
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  accessInstructions: z.string().max(500).optional(),
});

export const createBookingSchema = z.object({
  userId: z.string().uuid().optional(),
  serviceType: z.string().min(2),
  serviceId: z.string().uuid().optional(),
  address: bookingAddressSchema,
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  notes: z.string().max(500).optional(),
  extras: z.array(z.string()).default([]),
});

export const updateBookingSchema = z.object({
  scheduledStart: z.string().datetime().optional(),
  scheduledEnd: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().min(3).max(500),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
