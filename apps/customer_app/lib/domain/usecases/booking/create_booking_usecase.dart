import 'package:customer_app/domain/entities/booking.dart';
import 'package:customer_app/domain/repositories/booking_repository.dart';

class CreateBookingUsecase {
  CreateBookingUsecase(this._repository);

  final BookingRepository _repository;

  Future<Booking> call(Booking booking) => _repository.createBooking(booking);
}
