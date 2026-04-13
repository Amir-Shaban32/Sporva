export type ServiceResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
      code?:
        | "NOT_FOUND"
        | "DB_ERROR"
        | "INVALID_ID"
        | "CONFLICT"
        | "UNAUTHORIZED";
    };
