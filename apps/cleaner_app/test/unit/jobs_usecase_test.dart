import 'package:cleaner_app/domain/entities/job.dart';
import 'package:cleaner_app/domain/repositories/jobs_repository.dart';
import 'package:cleaner_app/domain/usecases/jobs/get_today_jobs_usecase.dart';
import 'package:flutter_test/flutter_test.dart';

class _FakeJobsRepository implements JobsRepository {
  @override
  Future<List<Job>> getTodayJobs() async => <Job>[
        Job(
          id: 'job_01',
          customerName: 'Maya',
          serviceName: 'Deep Clean',
          address: '123 Mission St',
          scheduledAt: DateTime(2026, 1, 1, 9),
          status: 'Assigned',
          payout: 110,
        ),
      ];

  @override
  Future<Job> updateJobStatus(String jobId, String status) {
    throw UnimplementedError();
  }
}

void main() {
  test('get today jobs returns planned assignments', () async {
    final List<Job> jobs = await GetTodayJobsUsecase(_FakeJobsRepository())();

    expect(jobs, hasLength(1));
    expect(jobs.first.customerName, 'Maya');
  });
}
