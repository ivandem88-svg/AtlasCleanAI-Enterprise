import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:management_app/core/theme/app_theme.dart';
import 'package:management_app/data/datasources/remote/management_remote_datasource.dart';
import 'package:management_app/data/repositories/management_repository_impl.dart';
import 'package:management_app/domain/usecases/get_dashboard_metrics_usecase.dart';
import 'package:management_app/presentation/blocs/dashboard_bloc.dart';
import 'package:management_app/presentation/blocs/dashboard_event.dart';
import 'package:management_app/presentation/router/app_router.dart';

class ManagementApp extends StatelessWidget {
  const ManagementApp({super.key});

  @override
  Widget build(BuildContext context) {
    final ManagementRepositoryImpl repository = ManagementRepositoryImpl(
      const ManagementRemoteDatasource(),
    );

    return BlocProvider<DashboardBloc>(
      create: (_) => DashboardBloc(GetDashboardMetricsUsecase(repository))..add(const LoadDashboard()),
      child: MaterialApp.router(
        debugShowCheckedModeBanner: false,
        title: 'AtlasCleanAI Management',
        theme: AppTheme.lightTheme,
        routerConfig: AppRouter().router,
      ),
    );
  }
}
