import type { HttpClient } from "@fa/core-desktop";
import type { BaseUser, LoginToken } from "./types";

export interface BaseDesktopApi {
  login(username: string, password: string): Promise<LoginToken>;
  getCurrentUser(): Promise<BaseUser>;
  logout(): Promise<void>;
}

export function createBaseDesktopApi(httpClient: HttpClient): BaseDesktopApi {
  return {
    login: (username, password) =>
      httpClient.post<LoginToken>("/base/admin/auth/login", { username, password }, { skipAuth: true }),
    getCurrentUser: () => httpClient.get<BaseUser>("/base/admin/user/getLoginUser"),
    logout: async () => {
      await httpClient.get<unknown>("/base/admin/auth/logout");
    },
  };
}
