import 'package:cleaner_app/core/utils/date_utils.dart';
import 'package:cleaner_app/presentation/blocs/earnings/earnings_bloc.dart';
import 'package:cleaner_app/presentation/blocs/earnings/earnings_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class EarningsScreen extends StatelessWidget {
  const EarningsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Earnings')),
      body: BlocBuilder<EarningsBloc, EarningsState>(
        builder: (BuildContext context, EarningsState state) {
          if (state.status == EarningsStatus.loading) {
            return const Center(child: CircularProgressIndicator());
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: state.earnings.length,
            itemBuilder: (BuildContext context, int index) {
              final earning = state.earnings[index];
              return Card(
                child: ListTile(
                  title: Text(earning.periodLabel),
                  subtitle: Text('${earning.completedJobs} completed jobs'),
                  trailing: Text(AtlasDateUtils.formatCurrency(earning.total)),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
