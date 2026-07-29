import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:customer_app/domain/entities/booking.dart';
import 'package:customer_app/domain/usecases/booking/create_booking_usecase.dart';
import 'package:customer_app/domain/usecases/booking/get_bookings_usecase.dart';
import 'package:customer_app/presentation/blocs/booking/booking_event.dart';
import 'package:customer_app/presentation/blocs/booking/booking_state.dart';

class BookingBloc extends Bloc<BookingEvent, BookingState> {
  BookingBloc({
    required CreateBookingUsecase createBookingUsecase,
    required GetBookingsUsecase getBookingsUsecase,
  })  : _createBookingUsecase = createBookingUsecase,
        _getBookingsUsecase = getBookingsUsecase,
        super(const BookingState()) {
    on<LoadBookingsRequested>(_onLoadBookingsRequested);
    on<CreateBookingRequested>(_onCreateBookingRequested);
  }

  final CreateBookingUsecase _createBookingUsecase;
  final GetBookingsUsecase _getBookingsUsecase;

  Future<void> _onLoadBookingsRequested(
    LoadBookingsRequested event,
    Emitter<BookingState> emit,
  ) async {
    emit(state.copyWith(status: BookingStatus.loading));
    try {
      final List<Booking> bookings = await _getBookingsUsecase();
      emit(state.copyWith(status: BookingStatus.success, bookings: bookings));
    } catch (error) {
      emit(state.copyWith(status: BookingStatus.failure, errorMessage: error.toString()));
    }
  }

  Future<void> _onCreateBookingRequested(
    CreateBookingRequested event,
    Emitter<BookingState> emit,
  ) async {
    emit(state.copyWith(status: BookingStatus.loading));
    try {
      final Booking booking = await _createBookingUsecase(event.booking);
      final List<Booking> updated = <Booking>[booking, ...state.bookings];
      emit(state.copyWith(status: BookingStatus.success, bookings: updated));
    } catch (error) {
      emit(state.copyWith(status: BookingStatus.failure, errorMessage: error.toString()));
    }
  }
}
