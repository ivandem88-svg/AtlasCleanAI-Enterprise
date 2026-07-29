import 'package:cleaner_app/presentation/screens/auth/login_screen.dart';
import 'package:cleaner_app/presentation/screens/dashboard/dashboard_screen.dart';
import 'package:cleaner_app/presentation/screens/earnings/earnings_screen.dart';
import 'package:cleaner_app/presentation/screens/jobs/job_detail_screen.dart';
import 'package:cleaner_app/presentation/screens/jobs/today_jobs_screen.dart';
import 'package:cleaner_app/presentation/screens/navigation/navigation_screen.dart';
import 'package:cleaner_app/presentation/screens/sos/sos_screen.dart';
import 'package:cleaner_app/presentation/screens/splash/splash_screen.dart';
import 'package:cleaner_app/presentation/screens/training/training_portal_screen.dart';
import 'package:go_router/go_router.dart';

class AppRouter {
  late final GoRouter router = GoRouter(
    routes: <GoRoute>[
      GoRoute(path: '/', builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
      GoRoute(path: '/jobs', builder: (_, __) => const TodayJobsScreen()),
      GoRoute(path: '/job-detail', builder: (_, __) => const JobDetailScreen()),
      GoRoute(path: '/navigation', builder: (_, __) => const NavigationScreen()),
      GoRoute(path: '/earnings', builder: (_, __) => const EarningsScreen()),
      GoRoute(path: '/training', builder: (_, __) => const TrainingPortalScreen()),
      GoRoute(path: '/sos', builder: (_, __) => const SosScreen()),
    ],
  );
}
