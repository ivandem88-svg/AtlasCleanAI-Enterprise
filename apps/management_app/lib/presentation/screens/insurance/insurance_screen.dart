import 'package:flutter/material.dart';

class InsuranceScreen extends StatelessWidget {
  const InsuranceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Insurance')),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text('Review coverage claims, incidents, and partner insurer coordination.', textAlign: TextAlign.center),
        ),
      ),
    );
  }
}
