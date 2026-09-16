export interface TenantUser {
  id?: string | null;
  tenantId: string;
  tenantName?: string | null;
  userId?: string | null;
  isAdmin?: boolean | null;
  status?: boolean | null;
  sort?: number | null;
  description?: string | null;
}

export interface TenantWorkspace extends TenantUser {
  unreadCount: number;
}
