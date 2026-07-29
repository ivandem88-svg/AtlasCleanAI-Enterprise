import 'package:customer_app/data/datasources/remote/booking_remote_datasource.dart';
import 'package:customer_app/data/models/booking_model.dart';
import 'package:customer_app/domain/entities/booking.dart';
import 'package:customer_app/domain/repositories/booking_repository.dart';

class BookingRepositoryImpl implements BookingRepository {
  BookingRepositoryImpl(this._remoteDatasource);

  final BookingRemoteDatasource _remoteDatasource;

  @override
  Future<Booking> createBooking(Booking booking) async {
    return _remoteDatasource.createBooking(BookingModel.fromEntity(booking));
  }

  @override
  Future<List<Booking>> getBookings() => _remoteDatasource.getBookings();
}
