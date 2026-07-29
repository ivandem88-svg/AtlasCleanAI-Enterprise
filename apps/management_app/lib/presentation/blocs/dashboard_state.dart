import 'package:equatable/equatable.dart';
import 'package:management_app/domain/entities/dashboard_metric.dart';

enum DashboardStatus { initial, loading, loaded, failure }

class DashboardState extends Equatable {
  const DashboardState({
    this.status = DashboardStatus.initial,
    this.metrics = const <DashboardMetric>[],
    this.errorMessage,
  });

  final DashboardStatus status;
  final List<DashboardMetric> metrics;
  final String? errorMessage;

  DashboardState copyWith({
    DashboardStatus? status,
    List<DashboardMetric>? metrics,
    String? errorMessage,
  }) {
    return DashboardState(
      status: status ?? this.status,
      metrics: metrics ?? this.metrics,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => <Object?>[status, metrics, errorMessage];
}
