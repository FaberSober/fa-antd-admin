export interface MobileMessage {
  id: number;
  fromUserName?: string | null;
  fromUserId?: string | null;
  toUserName?: string | null;
  toUserId?: string | null;
  content?: string | null;
  isRead?: boolean | null;
  readTime?: string | null;
  buzzType?: string | null;
  buzzId?: string | null;
  type?: number | null;
  buzzContent?: string | null;
  crtTime?: string | null;
}

export interface MobileMessagePageRequest {
  current: number;
  pageSize: number;
  query?: Record<string, unknown>;
}

export interface MobileMessagePagination {
  total: number;
  pageSize: number;
  current: number;
  pages: number;
  startRow: number;
  endRow: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface MobileMessagePageResult {
  pagination: MobileMessagePagination;
  total: number;
  rows: MobileMessage[];
}
