import 'package:cleaner_app/domain/entities/job.dart';
import 'package:equatable/equatable.dart';

enum JobsStatus { initial, loading, loaded, failure }

class JobsState extends Equatable {
  const JobsState({
    this.status = JobsStatus.initial,
    this.jobs = const <Job>[],
    this.errorMessage,
  });

  final JobsStatus status;
  final List<Job> jobs;
  final String? errorMessage;

  JobsState copyWith({
    JobsStatus? status,
    List<Job>? jobs,
    String? errorMessage,
  }) {
    return JobsState(
      status: status ?? this.status,
      jobs: jobs ?? this.jobs,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => <Object?>[status, jobs, errorMessage];
}
