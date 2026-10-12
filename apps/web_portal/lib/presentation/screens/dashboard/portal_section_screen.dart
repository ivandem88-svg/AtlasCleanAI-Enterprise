import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:web_portal/presentation/screens/dashboard/portal_sections.dart';

class PortalSectionScreen extends StatelessWidget {
  const PortalSectionScreen({required this.slug, super.key});

  final String slug;

  @override
  Widget build(BuildContext context) {
    final PortalSection? section = findPortalSection(slug);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          tooltip: 'Back to dashboard',
          onPressed: () => context.go('/dashboard'),
        ),
        title: Text(section?.title ?? 'Not found'),
      ),
      body: section == null
          ? Center(
              child: TextButton(
                onPressed: () => context.go('/dashboard'),
                child: const Text('Section not found. Back to dashboard'),
              ),
            )
          : ListView(
              padding: const EdgeInsets.all(16),
              children: <Widget>[
                Text(section.summary, style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 12),
                for (final PortalRow row in section.rows)
                  Card(
                    child: ListTile(
                      leading: Icon(section.icon),
                      title: Text(row.title),
                      subtitle: Text(row.subtitle),
                      trailing: Text(row.trailing),
                    ),
                  ),
              ],
            ),
    );
  }
}
