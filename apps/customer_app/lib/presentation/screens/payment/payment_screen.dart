import 'package:flutter/material.dart';

import 'package:customer_app/core/utils/date_utils.dart';

class PaymentScreen extends StatelessWidget {
  const PaymentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Card(
              child: ListTile(
                title: const Text('Upcoming invoice'),
                subtitle: const Text('Premium Office Refresh'),
                trailing: Text(AtlasDateUtils.formatCurrency(189)),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Payment sheet initialized.')),
                );
              },
              icon: const Icon(Icons.lock_outline),
              label: const Text('Pay securely'),
            ),
          ],
        ),
      ),
    );
  }
}
