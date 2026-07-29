import 'package:flutter/material.dart';

class ComplaintsScreen extends StatelessWidget {
  const ComplaintsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Complaints')),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text('Triages customer escalations, root causes, and remediation status.', textAlign: TextAlign.center),
        ),
      ),
    );
  }
}
