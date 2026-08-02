import 'package:flutter/material.dart';

class FinanceScreen extends StatelessWidget {
  const FinanceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Finance')),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text('Track revenue, payouts, insurance reserves, and enterprise billing health.', textAlign: TextAlign.center),
        ),
      ),
    );
  }
}
