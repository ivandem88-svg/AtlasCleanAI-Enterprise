import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<({String label, IconData icon, String route})> shortcuts =
        <({String label, IconData icon, String route})>[
      (label: 'Today's jobs', icon: Icons.assignment_outlined, route: '/jobs'),
      (label: 'Navigation', icon: Icons.navigation_outlined, route: '/navigation'),
      (label: 'Earnings', icon: Icons.attach_money, route: '/earnings'),
      (label: 'Training', icon: Icons.school_outlined, route: '/training'),
      (label: 'SOS', icon: Icons.sos, route: '/sos'),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Cleaner Dashboard')),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: shortcuts.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemBuilder: (BuildContext context, int index) {
          final item = shortcuts[index];
          return Card(
            child: InkWell(
              onTap: () => context.go(item.route),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Icon(item.icon, size: 36),
                  const SizedBox(height: 8),
                  Text(item.label, textAlign: TextAlign.center),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
