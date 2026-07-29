import 'package:flutter/material.dart';

class SosScreen extends StatelessWidget {
  const SosScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SOS')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            const Spacer(),
            const Icon(Icons.warning_amber_rounded, size: 96, color: Colors.red),
            const SizedBox(height: 16),
            const Text(
              'Emergency assistance',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            const Text(
              'Use this if you feel unsafe or need supervisor support immediately.',
              textAlign: TextAlign.center,
            ),
            const Spacer(),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Emergency alert sent to dispatch.')),
                );
              },
              icon: const Icon(Icons.call),
              label: const Text('Send SOS alert'),
            ),
          ],
        ),
      ),
    );
  }
}
