import 'package:equatable/equatable.dart';

import 'package:customer_app/domain/entities/booking.dart';

enum BookingStatus { initial, loading, success, failure }

class BookingState extends Equatable {
  const BookingState({
    this.status = BookingStatus.initial,
    this.bookings = const <Booking>[],
    this.errorMessage,
  });

  final BookingStatus status;
  final List<Booking> bookings;
  final String? errorMessage;

  BookingState copyWith({
    BookingStatus? status,
    List<Booking>? bookings,
    String? errorMessage,
  }) {
    return BookingState(
      status: status ?? this.status,
      bookings: bookings ?? this.bookings,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => <Object?>[status, bookings, errorMessage];
}
