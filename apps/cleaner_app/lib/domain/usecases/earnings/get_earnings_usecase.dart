import 'package:cleaner_app/domain/entities/earning.dart';
import 'package:cleaner_app/domain/repositories/earnings_repository.dart';

class GetEarningsUsecase {
  GetEarningsUsecase(this._repository);

  final EarningsRepository _repository;

  Future<List<Earning>> call() => _repository.getEarnings();
}
