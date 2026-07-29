import 'package:flutter/material.dart';

class WorkforceScreen extends StatelessWidget {
  const WorkforceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Workforce')),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text('Review cleaner utilization, staffing gaps, and SLA coverage across regions.', textAlign: TextAlign.center),
        ),
      ),
    );
  }
}
