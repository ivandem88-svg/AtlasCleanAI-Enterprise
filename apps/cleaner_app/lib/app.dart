import 'package:cleaner_app/core/theme/app_theme.dart';
import 'package:cleaner_app/data/datasources/remote/earnings_remote_datasource.dart';
import 'package:cleaner_app/data/datasources/remote/jobs_remote_datasource.dart';
import 'package:cleaner_app/data/repositories/earnings_repository_impl.dart';
import 'package:cleaner_app/data/repositories/jobs_repository_impl.dart';
import 'package:cleaner_app/domain/usecases/earnings/get_earnings_usecase.dart';
import 'package:cleaner_app/domain/usecases/jobs/get_today_jobs_usecase.dart';
import 'package:cleaner_app/domain/usecases/jobs/update_job_status_usecase.dart';
import 'package:cleaner_app/presentation/blocs/earnings/earnings_bloc.dart';
import 'package:cleaner_app/presentation/blocs/earnings/earnings_event.dart';
import 'package:cleaner_app/presentation/blocs/jobs/jobs_bloc.dart';
import 'package:cleaner_app/presentation/blocs/jobs/jobs_event.dart';
import 'package:cleaner_app/presentation/router/app_router.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CleanerApp extends StatelessWidget {
  const CleanerApp({super.key});

  @override
  Widget build(BuildContext context) {
    final JobsRepositoryImpl jobsRepository = JobsRepositoryImpl(const JobsRemoteDatasource());
    final EarningsRepositoryImpl earningsRepository = EarningsRepositoryImpl(const EarningsRemoteDatasource());

    return MultiBlocProvider(
      providers: <BlocProvider<dynamic>>[
        BlocProvider<JobsBloc>(
          create: (_) => JobsBloc(
            getTodayJobsUsecase: GetTodayJobsUsecase(jobsRepository),
            updateJobStatusUsecase: UpdateJobStatusUsecase(jobsRepository),
          )..add(const LoadTodayJobs()),
        ),
        BlocProvider<EarningsBloc>(
          create: (_) => EarningsBloc(GetEarningsUsecase(earningsRepository))..add(const LoadEarnings()),
        ),
      ],
      child: MaterialApp.router(
        debugShowCheckedModeBanner: false,
        title: 'AtlasCleanAI Cleaner',
        theme: AppTheme.lightTheme,
        routerConfig: AppRouter().router,
      ),
    );
  }
}
