import 'package:management_app/domain/entities/dashboard_metric.dart';
import 'package:management_app/domain/entities/report.dart';

abstract class ManagementRepository {
  Future<List<DashboardMetric>> getDashboardMetrics();
  Future<List<Report>> getReports();
}
