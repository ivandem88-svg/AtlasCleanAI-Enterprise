import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:management_app/presentation/blocs/dashboard_bloc.dart';
import 'package:management_app/presentation/blocs/dashboard_state.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<({String title, String route})> routes = <({String title, String route})>[
      (title: 'Workforce', route: '/workforce'),
      (title: 'Finance', route: '/finance'),
      (title: 'Reports', route: '/reports'),
      (title: 'Complaints', route: '/complaints'),
      (title: 'AI Analytics', route: '/ai-analytics'),
      (title: 'Insurance', route: '/insurance'),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Management Dashboard')),
      body: Column(
        children: <Widget>[
          Expanded(
            child: BlocBuilder<DashboardBloc, DashboardState>(
              builder: (BuildContext context, DashboardState state) {
                if (state.status == DashboardStatus.loading) {
                  return const Center(child: CircularProgressIndicator());
                }
                return GridView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: state.metrics.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.45,
                  ),
                  itemBuilder: (BuildContext context, int index) {
                    final metric = state.metrics[index];
                    return Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            Text(metric.title, style: Theme.of(context).textTheme.bodySmall),
                            const SizedBox(height: 8),
                            Text(metric.value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 6),
                            Text(metric.delta, style: const TextStyle(color: Colors.green)),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
          SizedBox(
            height: 120,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              scrollDirection: Axis.horizontal,
              itemBuilder: (BuildContext context, int index) {
                final route = routes[index];
                return SizedBox(
                  width: 140,
                  child: Card(
                    child: InkWell(
                      onTap: () => context.go(route.route),
                      child: Center(child: Text(route.title, textAlign: TextAlign.center)),
                    ),
                  ),
                );
              },
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemCount: routes.length,
            ),
          ),
        ],
      ),
    );
  }
}
