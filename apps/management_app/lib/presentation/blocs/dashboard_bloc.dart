import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:management_app/domain/usecases/get_dashboard_metrics_usecase.dart';
import 'package:management_app/presentation/blocs/dashboard_event.dart';
import 'package:management_app/presentation/blocs/dashboard_state.dart';

class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  DashboardBloc(this._getDashboardMetricsUsecase) : super(const DashboardState()) {
    on<LoadDashboard>(_onLoadDashboard);
  }

  final GetDashboardMetricsUsecase _getDashboardMetricsUsecase;

  Future<void> _onLoadDashboard(
    LoadDashboard event,
    Emitter<DashboardState> emit,
  ) async {
    emit(state.copyWith(status: DashboardStatus.loading));
    try {
      final metrics = await _getDashboardMetricsUsecase();
      emit(state.copyWith(status: DashboardStatus.loaded, metrics: metrics));
    } catch (error) {
      emit(state.copyWith(status: DashboardStatus.failure, errorMessage: error.toString()));
    }
  }
}
