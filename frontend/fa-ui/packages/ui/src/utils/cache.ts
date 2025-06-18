import { Fa } from '@ui/types';
import { each } from "lodash";

export function getToken(): string | null {
  return localStorage.getItem(Fa.Constant.TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(Fa.Constant.TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(Fa.Constant.TOKEN_KEY);
}


export enum LoginMode {
  LOCAL = '1',
  CAS = '2',
}

export function getLoginMode(): LoginMode | null {
  return localStorage.getItem(Fa.Constant.LOGIN_MODE_KEY) as LoginMode;
}

export function setLoginMode(mode: LoginMode) {
  localStorage.setItem(Fa.Constant.LOGIN_MODE_KEY, mode);
}

export function clearLoginMode() {
  localStorage.removeItem(Fa.Constant.LOGIN_MODE_KEY);
}

export function getTnCorpId(): string | null {
  return localStorage.getItem(Fa.Constant.FA_TN_CORP_ID);
}

export function setTnCorpId(corpId: string) {
  localStorage.setItem(Fa.Constant.FA_TN_CORP_ID, corpId);
}

export function clearTnCorpId() {
  localStorage.removeItem(Fa.Constant.FA_TN_CORP_ID);
}

/**
 * 返回请求headers中的鉴权内容
 */
export function genAuthHeaders() {
  const headers:any = {};

  const token = getToken();
  if (token) {
    headers[Fa.Constant.TOKEN_KEY] = token;
  }
  headers[Fa.Constant.FA_TN_CORP_ID] = getTnCorpId();
  headers[Fa.Constant.FA_FROM] = window.FaFrom;
  headers[Fa.Constant.FA_VERSION_CODE] = window.FaVersionCode;
  headers[Fa.Constant.FA_VERSION_NAME] = window.FaVersionName;

  // 读取window.faHeader中配置的
  if (window.faHeader) {
    each(window.faHeader, (v,k) => {
      // console.log('v', v, 'k', k)
      headers[k] = v;
    })
  }

  return headers;
}

/**
 * 将鉴权的headers内容添加到指定对象中
 * @param headersToAdd
 */
export function addAuthHeaders(headers:any) {
  const headersAuth = genAuthHeaders();
  each(headersAuth, (v,k) => {
    // console.log('v', v, 'k', k)
    headers[k] = v;
  })
}
