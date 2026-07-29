import 'package:cleaner_app/data/datasources/remote/jobs_remote_datasource.dart';
import 'package:cleaner_app/domain/entities/job.dart';
import 'package:cleaner_app/domain/repositories/jobs_repository.dart';

class JobsRepositoryImpl implements JobsRepository {
  JobsRepositoryImpl(this._remoteDatasource);

  final JobsRemoteDatasource _remoteDatasource;

  @override
  Future<List<Job>> getTodayJobs() => _remoteDatasource.getTodayJobs();

  @override
  Future<Job> updateJobStatus(String jobId, String status) {
    return _remoteDatasource.updateJobStatus(jobId, status);
  }
}
