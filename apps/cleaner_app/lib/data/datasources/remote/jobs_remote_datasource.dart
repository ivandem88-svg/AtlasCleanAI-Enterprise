import 'dart:async';

import 'package:cleaner_app/data/models/job_model.dart';

class JobsRemoteDatasource {
  const JobsRemoteDatasource();

  Future<List<JobModel>> getTodayJobs() async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    return <JobModel>[
      JobModel(
        id: 'job_01',
        customerName: 'Maya Chen',
        serviceName: 'Post-renovation clean',
        address: '410 Howard St, San Francisco, CA',
        scheduledAt: DateTime.now().add(const Duration(hours: 2)),
        status: 'Assigned',
        payout: 120,
      ),
      JobModel(
        id: 'job_02',
        customerName: 'Northwind Office',
        serviceName: 'Midday office reset',
        address: '600 Folsom St, San Francisco, CA',
        scheduledAt: DateTime.now().add(const Duration(hours: 5)),
        status: 'In progress',
        payout: 95,
      ),
    ];
  }

  Future<JobModel> updateJobStatus(String jobId, String status) async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    return JobModel(
      id: jobId,
      customerName: 'Updated customer',
      serviceName: 'Updated service',
      address: 'Updated address',
      scheduledAt: DateTime.now(),
      status: status,
      payout: 110,
    );
  }
}
