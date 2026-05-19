/** Generic server action result */
export interface ActionResult<T = undefined> {
  ok: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/** Paginated list response */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/** Session payload stored in cookie / JWT */
export interface SessionPayload {
  userId: string;
  role: 'PENYEWA' | 'MITRA' | 'ADMIN';
  sessionId: string;
  iat: number;
  exp: number;
}
