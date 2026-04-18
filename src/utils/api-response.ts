export class ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;

  constructor(
    statusCode: number,
    data?: T,
    message?: string,
    errors?: Record<string, string[]>,
  ) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}
