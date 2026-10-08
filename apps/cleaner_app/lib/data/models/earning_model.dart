import 'package:cleaner_app/domain/entities/earning.dart';

class EarningModel extends Earning {
  const EarningModel({
    required super.periodLabel,
    required super.total,
    required super.completedJobs,
  });
}
