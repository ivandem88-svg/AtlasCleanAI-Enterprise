import 'package:equatable/equatable.dart';

class JobsEvent extends Equatable {
  const JobsEvent();

  @override
  List<Object?> get props => <Object?>[];
}

class LoadTodayJobs extends JobsEvent {
  const LoadTodayJobs();
}

class UpdateJobStatusRequested extends JobsEvent {
  const UpdateJobStatusRequested({required this.jobId, required this.status});

  final String jobId;
  final String status;

  @override
  List<Object?> get props => <Object?>[jobId, status];
}
