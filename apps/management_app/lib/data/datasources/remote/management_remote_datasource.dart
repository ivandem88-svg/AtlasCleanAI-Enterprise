import 'dart:async';

import 'package:management_app/data/models/dashboard_metric_model.dart';
import 'package:management_app/data/models/report_model.dart';

class ManagementRemoteDatasource {
  const ManagementRemoteDatasource();

  Future<List<DashboardMetricModel>> getDashboardMetrics() async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    return const <DashboardMetricModel>[
      DashboardMetricModel(title: 'Active cleaners', value: '184', delta: '+8%'),
      DashboardMetricModel(title: 'Open jobs', value: '67', delta: '-3%'),
      DashboardMetricModel(title: 'Revenue today', value: '\$18.4k', delta: '+12%'),
      DashboardMetricModel(title: 'Complaints', value: '4', delta: '-21%'),
    ];
  }

  Future<List<ReportModel>> getReports() async {
    await Future<void>.delayed(const Duration(milliseconds: 180));
    return <ReportModel>[
      ReportModel(name: 'Shift performance', generatedAt: DateTime.now(), status: 'Ready'),
      ReportModel(name: 'Customer sentiment', generatedAt: DateTime.now(), status: 'Processing'),
    ];
  }
}
