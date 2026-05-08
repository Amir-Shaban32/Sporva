import {
  PaginationMeta,
  ApiErrorShape,
  ApiResponseShape,
} from "@shared/types/express/express";

export class ApiResponse {
  static formatSuccess<T>(
    data: T,
    message: string,
    meta?: PaginationMeta,
  ): ApiResponseShape<T> {
    return {
      success: true,
      data,
      message,
      ...(meta !== undefined && { meta }),
      timestamp: new Date().toISOString(),
    };
  }

  static formatError(
    message: string,
    errors?: unknown,
    requestId?: string,
  ): ApiErrorShape {
    return {
      success: false,
      error: {
        message,
        ...(errors !== undefined && { errors }),
      },
      ...(requestId !== undefined && { requestId }),
      timestamp: new Date().toISOString(),
    };
  }
}
