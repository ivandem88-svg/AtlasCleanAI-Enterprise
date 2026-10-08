import 'package:flutter/material.dart';

class PortalDashboardScreen extends StatelessWidget {
  const PortalDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Portal dashboard')),
      body: GridView.count(
        padding: const EdgeInsets.all(16),
        crossAxisCount: 3,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        children: const <Widget>[
          _PortalTile(title: 'Bookings', icon: Icons.calendar_month),
          _PortalTile(title: 'Cleaners', icon: Icons.groups_2_outlined),
          _PortalTile(title: 'Invoices', icon: Icons.receipt_long_outlined),
          _PortalTile(title: 'Automation', icon: Icons.auto_graph_outlined),
          _PortalTile(title: 'SLA', icon: Icons.verified_outlined),
          _PortalTile(title: 'Support', icon: Icons.support_agent_outlined),
        ],
      ),
    );
  }
}

class _PortalTile extends StatelessWidget {
  const _PortalTile({required this.title, required this.icon});

  final String title;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Icon(icon, size: 36),
          const SizedBox(height: 10),
          Text(title),
        ],
      ),
    );
  }
}
