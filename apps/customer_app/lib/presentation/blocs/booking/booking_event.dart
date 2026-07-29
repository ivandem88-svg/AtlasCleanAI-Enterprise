import 'package:equatable/equatable.dart';

import 'package:customer_app/domain/entities/booking.dart';

abstract class BookingEvent extends Equatable {
  const BookingEvent();

  @override
  List<Object?> get props => <Object?>[];
}

class LoadBookingsRequested extends BookingEvent {
  const LoadBookingsRequested();
}

class CreateBookingRequested extends BookingEvent {
  const CreateBookingRequested(this.booking);

  final Booking booking;

  @override
  List<Object?> get props => <Object?>[booking];
}
