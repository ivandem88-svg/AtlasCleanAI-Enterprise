import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:customer_app/core/constants/app_constants.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future<void>.delayed(AppConstants.splashDelay, () {
      if (mounted) {
        context.go('/login');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Icon(Icons.auto_awesome, size: 72),
            SizedBox(height: 16),
            Text('AtlasCleanAI', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('Smart cleaning, booked in minutes.'),
          ],
        ),
      ),
    );
  }
}
