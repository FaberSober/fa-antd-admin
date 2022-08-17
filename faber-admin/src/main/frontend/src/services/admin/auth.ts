import FaberBase from '@/props/base/FaberBase';
import { requestPost } from '@/utils/request';
import Ajax from '@/props/base/Ajax';

/**
 * 用户登录
 * @param username
 * @param password
 */
export function login(username: string, password: string): Promise<Ajax.Response<string>> {
	return requestPost('/api/auth/jwt/token', { username, password });
}

/**
 * 用户登录[使用注册中心]
 * @param username
 * @param password
 */
export function loginRegistry(username: string, password: string): Promise<Ajax.Response<string>> {
	return requestPost(`/origin/api/login?username=${username}&password=${password}`, { username, password });
}

/**
 * [Portal]用户登录
 */
export function ssoLogin(): Promise<Ajax.Response<FaberBase.CasUserEntity>> {
	return requestPost('/api/auth/sso/token', {});
}
