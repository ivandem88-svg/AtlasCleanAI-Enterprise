import 'package:flutter/material.dart';

class AiAnalyticsScreen extends StatelessWidget {
  const AiAnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI analytics')),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text('Monitor forecasting confidence, anomaly flags, and automation lift.', textAlign: TextAlign.center),
        ),
      ),
    );
  }
}
