import { request } from '../common/request';
import type {
  PortalContactDetail,
  PortalContactPageRequest,
  PortalContactPageResult,
  PortalContactSummary,
  PortalDepartmentNode,
} from '../types/contacts';

export function getContactDepartments(): Promise<PortalDepartmentNode[]> {
  return request<PortalDepartmentNode[]>({
    url: '/portal/contacts/departments/tree',
    method: 'GET',
  });
}

export function pageContacts(params: PortalContactPageRequest): Promise<PortalContactPageResult> {
  return request<PortalContactPageResult>({
    url: '/portal/contacts/users/page',
    method: 'POST',
    data: {
      current: params.current,
      pageSize: params.pageSize,
      query: params.query,
      sorter: params.sorter,
    },
  });
}

export function getContactDetail(userId: string): Promise<PortalContactDetail> {
  return request<PortalContactDetail>({
    url: `/portal/contacts/users/${encodeURIComponent(userId)}`,
    method: 'GET',
  });
}

export type { PortalContactSummary };
