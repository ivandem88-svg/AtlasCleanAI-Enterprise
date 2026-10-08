import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import 'package:customer_app/domain/entities/cleaner.dart';

class CleanerCard extends StatelessWidget {
  const CleanerCard({required this.cleaner, super.key});

  final Cleaner cleaner;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundImage: CachedNetworkImageProvider(cleaner.avatarUrl),
        ),
        title: Text(cleaner.name),
        subtitle: Text('Rating ${cleaner.rating} • ${cleaner.specialties.join(', ')}'),
      ),
    );
  }
}
