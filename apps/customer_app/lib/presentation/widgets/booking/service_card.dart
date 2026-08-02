import 'package:flutter/material.dart';

import 'package:customer_app/core/utils/date_utils.dart';
import 'package:customer_app/domain/entities/service.dart';

class ServiceCard extends StatelessWidget {
  const ServiceCard({required this.service, super.key});

  final Service service;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: const CircleAvatar(child: Icon(Icons.cleaning_services_outlined)),
        title: Text(service.name),
        subtitle: Text(service.description),
        trailing: Text(AtlasDateUtils.formatCurrency(service.basePrice)),
      ),
    );
  }
}
