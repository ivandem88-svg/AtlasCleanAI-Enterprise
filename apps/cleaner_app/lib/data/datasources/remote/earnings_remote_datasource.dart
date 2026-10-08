import 'dart:async';

import 'package:cleaner_app/data/models/earning_model.dart';

class EarningsRemoteDatasource {
  const EarningsRemoteDatasource();

  Future<List<EarningModel>> getEarnings() async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    return const <EarningModel>[
      EarningModel(periodLabel: 'Today', total: 215, completedJobs: 2),
      EarningModel(periodLabel: 'This week', total: 1240, completedJobs: 11),
      EarningModel(periodLabel: 'This month', total: 4980, completedJobs: 43),
    ];
  }
}
