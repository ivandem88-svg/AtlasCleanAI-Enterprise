import 'package:customer_app/domain/entities/booking.dart';

abstract class BookingRepository {
  Future<Booking> createBooking(Booking booking);
  Future<List<Booking>> getBookings();
}
