import {TOKEN_KEY} from '@/configs/server.config';

export function getToken(): string | null {
	return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
	sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
	sessionStorage.removeItem(TOKEN_KEY);
}
