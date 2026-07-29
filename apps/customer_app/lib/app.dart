import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:customer_app/core/network/api_client.dart';
import 'package:customer_app/core/theme/app_theme.dart';
import 'package:customer_app/data/datasources/local/secure_storage_datasource.dart';
import 'package:customer_app/data/datasources/remote/auth_remote_datasource.dart';
import 'package:customer_app/data/datasources/remote/booking_remote_datasource.dart';
import 'package:customer_app/data/repositories/auth_repository_impl.dart';
import 'package:customer_app/data/repositories/booking_repository_impl.dart';
import 'package:customer_app/domain/usecases/auth/login_usecase.dart';
import 'package:customer_app/domain/usecases/auth/register_usecase.dart';
import 'package:customer_app/domain/usecases/booking/create_booking_usecase.dart';
import 'package:customer_app/domain/usecases/booking/get_bookings_usecase.dart';
import 'package:customer_app/presentation/blocs/auth/auth_bloc.dart';
import 'package:customer_app/presentation/blocs/booking/booking_bloc.dart';
import 'package:customer_app/presentation/blocs/booking/booking_event.dart';
import 'package:customer_app/presentation/router/app_router.dart';

class CustomerApp extends StatelessWidget {
  const CustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    final ApiClient apiClient = ApiClient();
    final AuthRepositoryImpl authRepository = AuthRepositoryImpl(
      remoteDatasource: AuthRemoteDatasource(apiClient),
      secureStorageDatasource: SecureStorageDatasource(),
    );
    final BookingRepositoryImpl bookingRepository = BookingRepositoryImpl(
      const BookingRemoteDatasource(),
    );

    return MultiBlocProvider(
      providers: <BlocProvider<dynamic>>[
        BlocProvider<AuthBloc>(
          create: (_) => AuthBloc(
            loginUsecase: LoginUsecase(authRepository),
            registerUsecase: RegisterUsecase(authRepository),
          ),
        ),
        BlocProvider<BookingBloc>(
          create: (_) => BookingBloc(
            createBookingUsecase: CreateBookingUsecase(bookingRepository),
            getBookingsUsecase: GetBookingsUsecase(bookingRepository),
          )..add(const LoadBookingsRequested()),
        ),
      ],
      child: MaterialApp.router(
        title: 'AtlasCleanAI Customer',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        routerConfig: AppRouter().router,
      ),
    );
  }
}
