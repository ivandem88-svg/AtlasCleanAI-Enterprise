import 'package:management_app/domain/entities/report.dart';

class ReportModel extends Report {
  const ReportModel({
    required super.name,
    required super.generatedAt,
    required super.status,
  });
}
