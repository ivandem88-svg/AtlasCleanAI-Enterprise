import 'package:intl/intl.dart';

class AtlasDateUtils {
  const AtlasDateUtils._();

  static String formatDateTime(DateTime value) {
    return DateFormat('EEE, MMM d • h:mm a').format(value);
  }

  static String formatCurrency(num value) {
    return NumberFormat.currency(symbol: '\$').format(value);
  }
}
