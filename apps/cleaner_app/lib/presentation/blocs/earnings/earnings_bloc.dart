import 'package:cleaner_app/domain/entities/earning.dart';
import 'package:cleaner_app/domain/usecases/earnings/get_earnings_usecase.dart';
import 'package:cleaner_app/presentation/blocs/earnings/earnings_event.dart';
import 'package:cleaner_app/presentation/blocs/earnings/earnings_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class EarningsBloc extends Bloc<EarningsEvent, EarningsState> {
  EarningsBloc(this._getEarningsUsecase) : super(const EarningsState()) {
    on<LoadEarnings>(_onLoadEarnings);
  }

  final GetEarningsUsecase _getEarningsUsecase;

  Future<void> _onLoadEarnings(LoadEarnings event, Emitter<EarningsState> emit) async {
    emit(state.copyWith(status: EarningsStatus.loading));
    try {
      final List<Earning> earnings = await _getEarningsUsecase();
      emit(state.copyWith(status: EarningsStatus.loaded, earnings: earnings));
    } catch (error) {
      emit(state.copyWith(status: EarningsStatus.failure, errorMessage: error.toString()));
    }
  }
}
