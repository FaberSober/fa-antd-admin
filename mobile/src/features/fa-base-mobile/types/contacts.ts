export interface PortalDepartmentNode {
  id: string;
  parentId?: string | null;
  name: string;
  sort?: number | null;
  memberCount: number;
  hasChildren: boolean;
  children: PortalDepartmentNode[];
}

export interface PortalContactSummary {
  id: string;
  name: string;
  username?: string | null;
  avatar?: string | null;
  departmentId?: string | null;
  departmentName?: string | null;
  roleNames?: string | null;
  workStatus?: number | null;
}

export interface PortalContactDetail extends PortalContactSummary {
  username: string;
  tel?: string | null;
  email?: string | null;
}

export interface PortalContactPageFilter {
  keyword?: string;
  departmentId?: string;
}

export interface PortalContactPageRequest {
  current: number;
  pageSize: number;
  query?: PortalContactPageFilter;
  sorter?: string;
}

export interface PortalContactPagination {
  total: number;
  pageSize: number;
  current: number;
  pages: number;
  startRow: number;
  endRow: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PortalContactPageResult {
  pagination: PortalContactPagination;
  total: number;
  rows: PortalContactSummary[];
}
