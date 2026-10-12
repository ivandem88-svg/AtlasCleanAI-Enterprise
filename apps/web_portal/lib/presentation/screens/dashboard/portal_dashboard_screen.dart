import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:web_portal/presentation/screens/dashboard/portal_sections.dart';

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
        children: <Widget>[
          for (final PortalSection section in portalSections)
            _PortalTile(
              title: section.title,
              icon: section.icon,
              onTap: () => context.go('/dashboard/${section.slug}'),
            ),
        ],
      ),
    );
  }
}

class _PortalTile extends StatelessWidget {
  const _PortalTile({required this.title, required this.icon, required this.onTap});

  final String title;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Icon(icon, size: 36),
            const SizedBox(height: 10),
            Text(title),
          ],
        ),
      ),
    );
  }
}
