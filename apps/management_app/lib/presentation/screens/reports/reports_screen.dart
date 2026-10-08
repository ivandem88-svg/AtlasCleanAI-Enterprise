import 'package:flutter/material.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reports')),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text('Generate scheduled executive reports and export operational snapshots.', textAlign: TextAlign.center),
        ),
      ),
    );
  }
}
