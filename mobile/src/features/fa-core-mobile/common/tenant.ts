export const TENANT_HEADER = 'fa-tn-tenant-id';

let currentTenantId: string | null = null;

export function getTenantId(): string | null {
  return currentTenantId;
}

export function setTenantId(tenantId: string | null | undefined): void {
  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';
  currentTenantId = normalizedTenantId || null;
}

export function clearTenantId(): void {
  currentTenantId = null;
}
