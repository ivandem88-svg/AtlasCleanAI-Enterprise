import 'package:management_app/domain/entities/dashboard_metric.dart';
import 'package:management_app/domain/repositories/management_repository.dart';

class GetDashboardMetricsUsecase {
  GetDashboardMetricsUsecase(this._repository);

  final ManagementRepository _repository;

  Future<List<DashboardMetric>> call() => _repository.getDashboardMetrics();
}
