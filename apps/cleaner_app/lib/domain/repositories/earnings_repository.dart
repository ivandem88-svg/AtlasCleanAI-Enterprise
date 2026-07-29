import 'package:cleaner_app/domain/entities/earning.dart';

abstract class EarningsRepository {
  Future<List<Earning>> getEarnings();
}
