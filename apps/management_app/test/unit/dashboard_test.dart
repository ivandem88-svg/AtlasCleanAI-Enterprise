import 'package:flutter_test/flutter_test.dart';
import 'package:management_app/domain/entities/dashboard_metric.dart';
import 'package:management_app/domain/entities/report.dart';
import 'package:management_app/domain/repositories/management_repository.dart';
import 'package:management_app/domain/usecases/get_dashboard_metrics_usecase.dart';

class _FakeManagementRepository implements ManagementRepository {
  @override
  Future<List<DashboardMetric>> getDashboardMetrics() async {
    return const <DashboardMetric>[
      DashboardMetric(title: 'Revenue', value: '\$10k', delta: '+4%'),
    ];
  }

  @override
  Future<List<Report>> getReports() async => const <Report>[];
}

void main() {
  test('dashboard usecase returns metrics', () async {
    final List<DashboardMetric> result = await GetDashboardMetricsUsecase(
      _FakeManagementRepository(),
    )();

    expect(result.single.title, 'Revenue');
  });
}
