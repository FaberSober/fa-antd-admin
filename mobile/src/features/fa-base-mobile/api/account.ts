import { request } from '../common/request';

export interface UpdateMyProfileParams {
  username: string;
  name: string;
  tel: string;
  email: string;
  img: string;
}

export interface UpdateMyPasswordParams {
  oldPwd: string;
  newPwd: string;
}

export function updateMyProfile(params: UpdateMyProfileParams): Promise<boolean> {
  return request<boolean>({
    url: '/base/admin/user/updateMine',
    method: 'POST',
    data: { ...params },
  });
}

export function updateMyPassword(params: UpdateMyPasswordParams): Promise<boolean> {
  return request<boolean>({
    url: '/base/admin/user/updateMyPwd',
    method: 'POST',
    data: { ...params },
  });
}
