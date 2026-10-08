import 'package:flutter/material.dart';
import 'package:web_portal/core/theme/app_theme.dart';
import 'package:web_portal/data/datasources/remote/portal_remote_datasource.dart';
import 'package:web_portal/data/repositories/auth_repository_impl.dart';
import 'package:web_portal/domain/usecases/login_usecase.dart';
import 'package:web_portal/presentation/router/app_router.dart';

class WebPortalApp extends StatelessWidget {
  const WebPortalApp({super.key});

  @override
  Widget build(BuildContext context) {
    final LoginUsecase loginUsecase = LoginUsecase(
      AuthRepositoryImpl(const PortalRemoteDatasource()),
    );

    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      title: 'AtlasCleanAI Web Portal',
      theme: AppTheme.lightTheme,
      routerConfig: AppRouter(loginUsecase).router,
    );
  }
}
