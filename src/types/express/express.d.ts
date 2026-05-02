export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ApiResponseShape<T> {
  success: true;
  data: T;
  message: string;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface ApiErrorShape {
  success: false;
  error: {
    message: string;
    errors?: unknown;
  };
  requestId?: string;
  timestamp: string;
}

declare global {
  namespace Express {
    interface Response {
      ok<T>(message: string, data?: T): Response;
      created<T>(message: string, data?: T): Response;
      noContent<T>(): Response;
      paginated<T>(
        items: T[],
        total: number,
        page: number,
        limit: number,
        message?: string,
      ): Response;
    }

    interface Request {
      id: string;
      user?: {
        id: string;
        username: string;
        role: "USER" | "ADMIN";
      };
    }
  }
}
