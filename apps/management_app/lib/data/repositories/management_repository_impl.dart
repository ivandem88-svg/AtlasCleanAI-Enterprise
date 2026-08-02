import 'package:management_app/data/datasources/remote/management_remote_datasource.dart';
import 'package:management_app/domain/entities/dashboard_metric.dart';
import 'package:management_app/domain/entities/report.dart';
import 'package:management_app/domain/repositories/management_repository.dart';

class ManagementRepositoryImpl implements ManagementRepository {
  ManagementRepositoryImpl(this._remoteDatasource);

  final ManagementRemoteDatasource _remoteDatasource;

  @override
  Future<List<DashboardMetric>> getDashboardMetrics() {
    return _remoteDatasource.getDashboardMetrics();
  }

  @override
  Future<List<Report>> getReports() => _remoteDatasource.getReports();
}
