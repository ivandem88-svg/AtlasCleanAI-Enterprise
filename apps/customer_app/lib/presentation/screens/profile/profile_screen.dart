import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const <Widget>[
          CircleAvatar(radius: 42, child: Icon(Icons.person, size: 42)),
          SizedBox(height: 16),
          Card(child: ListTile(title: Text('Atlas Customer'), subtitle: Text('customer@atlasclean.ai'))),
          Card(child: ListTile(title: Text('Saved address'), subtitle: Text('890 Market St, San Francisco, CA'))),
          Card(child: ListTile(title: Text('Membership'), subtitle: Text('Enterprise Plus'))),
        ],
      ),
    );
  }
}
