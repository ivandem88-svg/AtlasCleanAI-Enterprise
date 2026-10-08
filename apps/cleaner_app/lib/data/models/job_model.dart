import 'package:cleaner_app/domain/entities/job.dart';

class JobModel extends Job {
  const JobModel({
    required super.id,
    required super.customerName,
    required super.serviceName,
    required super.address,
    required super.scheduledAt,
    required super.status,
    required super.payout,
  });
}
