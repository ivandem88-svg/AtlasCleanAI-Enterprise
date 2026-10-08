import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import 'package:customer_app/domain/entities/booking.dart';
import 'package:customer_app/domain/entities/cleaner.dart';
import 'package:customer_app/domain/entities/service.dart';
import 'package:customer_app/presentation/blocs/booking/booking_bloc.dart';
import 'package:customer_app/presentation/blocs/booking/booking_event.dart';
import 'package:customer_app/presentation/blocs/booking/booking_state.dart';
import 'package:customer_app/presentation/widgets/booking/cleaner_card.dart';
import 'package:customer_app/presentation/widgets/booking/service_card.dart';
import 'package:customer_app/presentation/widgets/common/atlas_button.dart';

class BookingScreen extends StatelessWidget {
  const BookingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const Service service = Service(
      id: 'svc_2',
      name: 'Premium Office Refresh',
      description: 'High-touch sanitization and workspace detailing.',
      basePrice: 189,
    );
    const Cleaner cleaner = Cleaner(
      id: 'cln_12',
      name: 'Alex Rivera',
      rating: 4.8,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      specialties: <String>['Office', 'Sanitization'],
    );

    return BlocConsumer<BookingBloc, BookingState>(
      listener: (BuildContext context, BookingState state) {
        if (state.status == BookingStatus.success) {
          context.go('/booking-confirmation');
        }
      },
      builder: (BuildContext context, BookingState state) {
        return Scaffold(
          appBar: AppBar(title: const Text('Schedule cleaning')),
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: <Widget>[
              const Text('Selected service', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
              const SizedBox(height: 12),
              const ServiceCard(service: service),
              const SizedBox(height: 16),
              const Text('Recommended cleaner', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
              const SizedBox(height: 12),
              const CleanerCard(cleaner: cleaner),
              const SizedBox(height: 24),
              AtlasButton(
                label: state.status == BookingStatus.loading ? 'Booking…' : 'Confirm booking',
                isLoading: state.status == BookingStatus.loading,
                onPressed: () {
                  context.read<BookingBloc>().add(
                        CreateBookingRequested(
                          Booking(
                            id: '',
                            userId: 'usr_101',
                            service: service,
                            cleaner: cleaner,
                            scheduledAt: DateTime.now().add(const Duration(days: 2)),
                            address: '200 Mission St, San Francisco, CA',
                            status: 'pending',
                            totalPrice: service.basePrice,
                          ),
                        ),
                      );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
