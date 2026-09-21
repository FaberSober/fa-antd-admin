import { request } from '../common/request';
import type { MobileMessagePageRequest, MobileMessagePageResult } from '../types/message';

export function pageMessages(params: MobileMessagePageRequest): Promise<MobileMessagePageResult> {
  return request<MobileMessagePageResult>({
    url: '/base/admin/msg/pageMine',
    method: 'POST',
    data: {
      current: params.current,
      pageSize: params.pageSize,
      query: params.query || {},
      sorter: 'crtTime DESC',
    },
  });
}
