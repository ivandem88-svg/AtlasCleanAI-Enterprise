import 'package:cleaner_app/domain/entities/job.dart';
import 'package:cleaner_app/domain/repositories/jobs_repository.dart';

class UpdateJobStatusUsecase {
  UpdateJobStatusUsecase(this._repository);

  final JobsRepository _repository;

  Future<Job> call({required String jobId, required String status}) {
    return _repository.updateJobStatus(jobId, status);
  }
}
