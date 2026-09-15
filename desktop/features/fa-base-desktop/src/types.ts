export interface LoginToken {
  tokenValue: string;
}

/** 当前用户页面会用到的安全字段。密码和 apiToken 永不进入页面模型。 */
export interface BaseUser {
  id: string | number;
  username: string;
  name?: string | null;
  tel?: string | null;
  email?: string | null;
  departmentName?: string | null;
  postName?: string | null;
  roleNames?: string | null;
  img?: string | null;
  status?: boolean;
}
