import 'package:go_router/go_router.dart';
import 'package:web_portal/domain/usecases/login_usecase.dart';
import 'package:web_portal/presentation/screens/auth/login_screen.dart';
import 'package:web_portal/presentation/screens/dashboard/portal_dashboard_screen.dart';
import 'package:web_portal/presentation/screens/landing/landing_screen.dart';

class AppRouter {
  AppRouter(this.loginUsecase);

  final LoginUsecase loginUsecase;

  late final GoRouter router = GoRouter(
    routes: <GoRoute>[
      GoRoute(path: '/', builder: (_, __) => const LandingScreen()),
      GoRoute(path: '/login', builder: (_, __) => LoginScreen(loginUsecase: loginUsecase)),
      GoRoute(path: '/dashboard', builder: (_, __) => const PortalDashboardScreen()),
    ],
  );
}
