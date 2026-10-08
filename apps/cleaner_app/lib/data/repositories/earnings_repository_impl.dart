import 'package:cleaner_app/data/datasources/remote/earnings_remote_datasource.dart';
import 'package:cleaner_app/domain/entities/earning.dart';
import 'package:cleaner_app/domain/repositories/earnings_repository.dart';

class EarningsRepositoryImpl implements EarningsRepository {
  EarningsRepositoryImpl(this._remoteDatasource);

  final EarningsRemoteDatasource _remoteDatasource;

  @override
  Future<List<Earning>> getEarnings() => _remoteDatasource.getEarnings();
}
