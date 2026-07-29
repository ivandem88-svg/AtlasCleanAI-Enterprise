import 'package:go_router/go_router.dart';
import 'package:management_app/presentation/screens/ai_analytics/ai_analytics_screen.dart';
import 'package:management_app/presentation/screens/complaints/complaints_screen.dart';
import 'package:management_app/presentation/screens/dashboard/dashboard_screen.dart';
import 'package:management_app/presentation/screens/finance/finance_screen.dart';
import 'package:management_app/presentation/screens/insurance/insurance_screen.dart';
import 'package:management_app/presentation/screens/reports/reports_screen.dart';
import 'package:management_app/presentation/screens/workforce/workforce_screen.dart';

class AppRouter {
  late final GoRouter router = GoRouter(
    routes: <GoRoute>[
      GoRoute(path: '/', builder: (_, __) => const DashboardScreen()),
      GoRoute(path: '/workforce', builder: (_, __) => const WorkforceScreen()),
      GoRoute(path: '/finance', builder: (_, __) => const FinanceScreen()),
      GoRoute(path: '/reports', builder: (_, __) => const ReportsScreen()),
      GoRoute(path: '/complaints', builder: (_, __) => const ComplaintsScreen()),
      GoRoute(path: '/ai-analytics', builder: (_, __) => const AiAnalyticsScreen()),
      GoRoute(path: '/insurance', builder: (_, __) => const InsuranceScreen()),
    ],
  );
}
