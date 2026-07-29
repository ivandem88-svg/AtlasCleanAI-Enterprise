import 'package:management_app/domain/entities/dashboard_metric.dart';

class DashboardMetricModel extends DashboardMetric {
  const DashboardMetricModel({
    required super.title,
    required super.value,
    required super.delta,
  });
}
