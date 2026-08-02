import 'package:customer_app/domain/entities/booking.dart';
import 'package:customer_app/domain/repositories/booking_repository.dart';

class GetBookingsUsecase {
  GetBookingsUsecase(this._repository);

  final BookingRepository _repository;

  Future<List<Booking>> call() => _repository.getBookings();
}
