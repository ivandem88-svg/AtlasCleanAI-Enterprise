import 'package:cleaner_app/domain/entities/job.dart';
import 'package:cleaner_app/domain/usecases/jobs/get_today_jobs_usecase.dart';
import 'package:cleaner_app/domain/usecases/jobs/update_job_status_usecase.dart';
import 'package:cleaner_app/presentation/blocs/jobs/jobs_event.dart';
import 'package:cleaner_app/presentation/blocs/jobs/jobs_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class JobsBloc extends Bloc<JobsEvent, JobsState> {
  JobsBloc({
    required GetTodayJobsUsecase getTodayJobsUsecase,
    required UpdateJobStatusUsecase updateJobStatusUsecase,
  })  : _getTodayJobsUsecase = getTodayJobsUsecase,
        _updateJobStatusUsecase = updateJobStatusUsecase,
        super(const JobsState()) {
    on<LoadTodayJobs>(_onLoadTodayJobs);
    on<UpdateJobStatusRequested>(_onUpdateJobStatusRequested);
  }

  final GetTodayJobsUsecase _getTodayJobsUsecase;
  final UpdateJobStatusUsecase _updateJobStatusUsecase;

  Future<void> _onLoadTodayJobs(LoadTodayJobs event, Emitter<JobsState> emit) async {
    emit(state.copyWith(status: JobsStatus.loading));
    try {
      final List<Job> jobs = await _getTodayJobsUsecase();
      emit(state.copyWith(status: JobsStatus.loaded, jobs: jobs));
    } catch (error) {
      emit(state.copyWith(status: JobsStatus.failure, errorMessage: error.toString()));
    }
  }

  Future<void> _onUpdateJobStatusRequested(
    UpdateJobStatusRequested event,
    Emitter<JobsState> emit,
  ) async {
    final Job updatedJob = await _updateJobStatusUsecase(jobId: event.jobId, status: event.status);
    final List<Job> jobs = state.jobs
        .map((Job job) => job.id == updatedJob.id ? updatedJob : job)
        .toList(growable: false);
    emit(state.copyWith(status: JobsStatus.loaded, jobs: jobs));
  }
}
