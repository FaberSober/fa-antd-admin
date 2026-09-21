import { request } from '../common/request';

export interface UpdateMyProfileParams {
  username: string;
  name: string;
  tel: string;
  email: string;
  img: string;
}

export function updateMyProfile(params: UpdateMyProfileParams): Promise<boolean> {
  return request<boolean>({
    url: '/base/admin/user/updateMine',
    method: 'POST',
    data: { ...params },
  });
}
