import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<({String label, IconData icon, String route})> items =
        <({String label, IconData icon, String route})>[
      (label: 'Book Service', icon: Icons.calendar_month, route: '/booking'),
      (label: 'Live Tracking', icon: Icons.map_outlined, route: '/tracking'),
      (label: 'Payments', icon: Icons.credit_card, route: '/payment'),
      (label: 'Profile', icon: Icons.person_outline, route: '/profile'),
      (label: 'Support Chat', icon: Icons.chat_bubble_outline, route: '/chat'),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('AtlasCleanAI')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.builder(
          itemCount: items.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.1,
          ),
          itemBuilder: (BuildContext context, int index) {
            final item = items[index];
            return Card(
              child: InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: () => context.go(item.route),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Icon(item.icon, size: 36),
                    const SizedBox(height: 12),
                    Text(item.label, textAlign: TextAlign.center),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
