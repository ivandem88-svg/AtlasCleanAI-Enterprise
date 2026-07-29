import 'dart:async';

import 'package:customer_app/data/models/booking_model.dart';
import 'package:customer_app/data/models/cleaner_model.dart';
import 'package:customer_app/data/models/service_model.dart';

class BookingRemoteDatasource {
  const BookingRemoteDatasource();

  Future<BookingModel> createBooking(BookingModel booking) async {
    await Future<void>.delayed(const Duration(milliseconds: 350));
    return BookingModel(
      id: booking.id.isEmpty ? 'bk_${DateTime.now().millisecondsSinceEpoch}' : booking.id,
      userId: booking.userId,
      service: booking.service,
      cleaner: booking.cleaner,
      scheduledAt: booking.scheduledAt,
      address: booking.address,
      status: 'confirmed',
      totalPrice: booking.totalPrice,
    );
  }

  Future<List<BookingModel>> getBookings() async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    return <BookingModel>[
      BookingModel(
        id: 'bk_001',
        userId: 'usr_101',
        service: const ServiceModel(
          id: 'svc_1',
          name: 'Deep Clean',
          description: 'Comprehensive room-by-room cleaning.',
          basePrice: 149,
        ),
        cleaner: const CleanerModel(
          id: 'cln_1',
          name: 'Rina Cole',
          rating: 4.9,
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
          specialties: <String>['Eco-safe', 'Move-out'],
        ),
        scheduledAt: DateTime.now().add(const Duration(days: 1)),
        address: '890 Market St, San Francisco, CA',
        status: 'scheduled',
        totalPrice: 149,
      ),
    ];
  }
}
