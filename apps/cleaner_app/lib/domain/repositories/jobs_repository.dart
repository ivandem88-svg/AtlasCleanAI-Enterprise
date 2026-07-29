import 'package:cleaner_app/domain/entities/job.dart';

abstract class JobsRepository {
  Future<List<Job>> getTodayJobs();
  Future<Job> updateJobStatus(String jobId, String status);
}
