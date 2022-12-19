import { message } from 'antd';
import { Fa } from '@fa/types';
import { findIndex, isNil, isUndefined, trim } from 'lodash';

/**
 * 展示服务端返回数据提示
 */
export function showResponse(response: Fa.Ret, prefix: string) {
  if (response && response.status === Fa.RES_CODE.OK) {
    message.success(`${prefix}成功`);
  }
}

/**
 * 复制文本到剪贴板
 */
export function handleClipboard(text: string, successMsg = '') {
  if (trim(text) === '') {
    return;
  }
  const textField = document.createElement('textarea');
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
  if (!isNil(successMsg)) {
    message.success(`${successMsg} 复制成功, Ctrl + V 使用`);
  } else {
    message.success(`${text} 复制成功, Ctrl + V 使用`);
  }
}

/**
 * 检查是否有权限
 * @param {array} permissions 用户菜单权限列表
 * @param {string} permissionCode 需要鉴定的权限点
 */
export function hasPermission(permissions?: string[], permissionCode?: string | undefined) {
  if (isUndefined(permissionCode)) return true;
  if (isUndefined(permissions) || permissions.length === 0) return false;
  return findIndex(permissions, (e) => e === permissionCode) > -1;
}
