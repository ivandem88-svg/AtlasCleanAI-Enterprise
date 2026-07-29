import 'package:flutter/material.dart';

class LiveTrackingScreen extends StatelessWidget {
  const LiveTrackingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Live tracking')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.blueGrey.shade100,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Center(
                  child: Icon(Icons.map, size: 96, color: Colors.black54),
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Card(
              child: ListTile(
                leading: CircleAvatar(child: Icon(Icons.directions_car)),
                title: Text('Cleaner en route'),
                subtitle: Text('ETA 12 minutes • Rina Cole'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
