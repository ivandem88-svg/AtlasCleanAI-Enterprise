import 'package:cleaner_app/domain/entities/job.dart';
import 'package:cleaner_app/domain/repositories/jobs_repository.dart';

class GetTodayJobsUsecase {
  GetTodayJobsUsecase(this._repository);

  final JobsRepository _repository;

  Future<List<Job>> call() => _repository.getTodayJobs();
}
