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
  // requestId?: string; later for logging
  timestamp: string;
}

declare global {
  namespace Express {
    interface Response {
      ok<T>(message: string, data?: T): Response;
      created<T>(message: string, data?: T): Response;
      paginated<T>(
        items: T[],
        total: number,
        page: number,
        limit: number,
        message?: string,
      ): Response;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}
