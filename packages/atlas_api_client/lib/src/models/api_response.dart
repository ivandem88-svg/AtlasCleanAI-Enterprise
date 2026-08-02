class ApiResponse<T> {
  const ApiResponse({
    required this.success,
    this.data,
    this.message,
    this.errors = const <String, dynamic>{},
    this.statusCode,
  });

  final bool success;
  final T? data;
  final String? message;
  final Map<String, dynamic> errors;
  final int? statusCode;

  factory ApiResponse.fromJson(
    Map<String, dynamic> json, {
    T Function(Object? json)? fromJsonT,
  }) {
    return ApiResponse<T>(
      success: json['success'] as bool? ?? false,
      data: fromJsonT != null ? fromJsonT(json['data']) : json['data'] as T?,
      message: json['message'] as String?,
      errors: (json['errors'] as Map?)?.cast<String, dynamic>() ?? const <String, dynamic>{},
      statusCode: json['statusCode'] as int?,
    );
  }

  Map<String, dynamic> toJson({Object? Function(T value)? toJsonT}) {
    return <String, dynamic>{
      'success': success,
      'data': data == null ? null : (toJsonT != null ? toJsonT(data as T) : data),
      'message': message,
      'errors': errors,
      'statusCode': statusCode,
    };
  }
}
