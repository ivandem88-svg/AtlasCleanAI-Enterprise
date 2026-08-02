import 'package:flutter/material.dart';

class NavigationScreen extends StatelessWidget {
  const NavigationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Turn-by-turn navigation')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: <Widget>[
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.lightBlue.shade50,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Center(child: Icon(Icons.map, size: 96)),
              ),
            ),
            const SizedBox(height: 16),
            const Card(child: ListTile(title: Text('Next stop'), subtitle: Text('410 Howard St • 18 min away'))),
          ],
        ),
      ),
    );
  }
}
