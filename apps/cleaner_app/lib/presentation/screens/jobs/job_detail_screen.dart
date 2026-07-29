import 'package:flutter/material.dart';

class JobDetailScreen extends StatelessWidget {
  const JobDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Job details')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const <Widget>[
          Card(child: ListTile(title: Text('Customer'), subtitle: Text('Maya Chen'))),
          Card(child: ListTile(title: Text('Service'), subtitle: Text('Post-renovation clean'))),
          Card(child: ListTile(title: Text('Notes'), subtitle: Text('Use hypoallergenic supplies in nursery area.'))),
        ],
      ),
    );
  }
}
