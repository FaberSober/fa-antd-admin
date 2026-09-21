import { request } from '../common/request';
import type { MobileMessagePageRequest, MobileMessagePageResult } from '../types/message';

export interface MobileMessageStatistics {
  unreadCount: number;
}

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

export function countMessages(): Promise<MobileMessageStatistics> {
  return request<MobileMessageStatistics>({
    url: '/base/admin/msg/countMine',
    method: 'GET',
  });
}

export function batchReadMessages(ids: number[]): Promise<boolean> {
  return request<boolean>({
    url: '/base/admin/msg/batchRead',
    method: 'POST',
    data: ids,
  });
}

export function readAllMessages(): Promise<boolean> {
  return request<boolean>({
    url: '/base/admin/msg/readAll',
    method: 'GET',
  });
}
