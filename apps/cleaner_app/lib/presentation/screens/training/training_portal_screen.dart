import 'package:flutter/material.dart';

class TrainingPortalScreen extends StatelessWidget {
  const TrainingPortalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const List<(String, String)> modules = <(String, String)>[
      ('Safety refresh', '15 minutes'),
      ('Customer etiquette', '10 minutes'),
      ('Equipment maintenance', '18 minutes'),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Training portal')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: modules.length,
        itemBuilder: (BuildContext context, int index) {
          final module = modules[index];
          return Card(child: ListTile(title: Text(module.$1), subtitle: Text(module.$2)));
        },
      ),
    );
  }
}
