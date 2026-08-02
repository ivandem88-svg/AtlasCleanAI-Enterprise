import 'package:cleaner_app/core/utils/date_utils.dart';
import 'package:cleaner_app/presentation/blocs/jobs/jobs_bloc.dart';
import 'package:cleaner_app/presentation/blocs/jobs/jobs_event.dart';
import 'package:cleaner_app/presentation/blocs/jobs/jobs_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class TodayJobsScreen extends StatelessWidget {
  const TodayJobsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Today's jobs')),
      body: BlocBuilder<JobsBloc, JobsState>(
        builder: (BuildContext context, JobsState state) {
          if (state.status == JobsStatus.loading) {
            return const Center(child: CircularProgressIndicator());
          }
          return RefreshIndicator(
            onRefresh: () async => context.read<JobsBloc>().add(const LoadTodayJobs()),
            child: ListView.builder(
              itemCount: state.jobs.length,
              itemBuilder: (BuildContext context, int index) {
                final job = state.jobs[index];
                return Card(
                  child: ListTile(
                    onTap: () => context.go('/job-detail'),
                    title: Text(job.customerName),
                    subtitle: Text('${job.serviceName}
${AtlasDateUtils.formatDateTime(job.scheduledAt)}'),
                    trailing: Chip(label: Text(job.status)),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
