import 'package:go_router/go_router.dart';

import 'package:customer_app/presentation/screens/auth/login_screen.dart';
import 'package:customer_app/presentation/screens/auth/register_screen.dart';
import 'package:customer_app/presentation/screens/booking/booking_confirmation_screen.dart';
import 'package:customer_app/presentation/screens/booking/booking_screen.dart';
import 'package:customer_app/presentation/screens/chat/chat_screen.dart';
import 'package:customer_app/presentation/screens/home/home_screen.dart';
import 'package:customer_app/presentation/screens/payment/payment_screen.dart';
import 'package:customer_app/presentation/screens/profile/profile_screen.dart';
import 'package:customer_app/presentation/screens/splash/splash_screen.dart';
import 'package:customer_app/presentation/screens/tracking/live_tracking_screen.dart';

class AppRouter {
  AppRouter();

  late final GoRouter router = GoRouter(
    routes: <GoRoute>[
      GoRoute(path: '/', builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
      GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
      GoRoute(path: '/booking', builder: (_, __) => const BookingScreen()),
      GoRoute(
        path: '/booking-confirmation',
        builder: (_, __) => const BookingConfirmationScreen(),
      ),
      GoRoute(path: '/tracking', builder: (_, __) => const LiveTrackingScreen()),
      GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
      GoRoute(path: '/payment', builder: (_, __) => const PaymentScreen()),
      GoRoute(path: '/chat', builder: (_, __) => const ChatScreen()),
    ],
  );
}
