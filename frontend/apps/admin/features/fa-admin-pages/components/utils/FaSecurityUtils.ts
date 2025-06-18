import { type Admin, FaEnums } from '@/types';

/**
 * 校验安全密码逻辑
 * @param password
 * @param systemConfig
 */
export function validatePasswordSafeRule(password: string, systemConfig: Admin.SystemConfigPo) {
  if (password.length < systemConfig.safePasswordLenMin) {
    return Promise.reject('密码长度要大于' + systemConfig.safePasswordLenMin);
  }
  if (password.length > systemConfig.safePasswordLenMax) {
    return Promise.reject('密码长度要小于' + systemConfig.safePasswordLenMax);
  }

  const noNum = /\d/.exec(password) === null;
  const noChar = /[a-zA-Z]/.exec(password) === null;
  const noSpec = /(?=.*[\.~!@#$%^&*])/.exec(password) === null;

  switch (systemConfig.safePasswordType) {
    case FaEnums.ConfigSysSafePasswordTypeEnum.NUM:
      if (noNum) {
        return Promise.reject('密码需要包含数字');
      }
      break;
    case FaEnums.ConfigSysSafePasswordTypeEnum.CHAR:
      if (noChar) {
        return Promise.reject('密码需要包含字母');
      }
      break;
    case FaEnums.ConfigSysSafePasswordTypeEnum.NUM_CHAR:
      if (noNum || noChar) {
        return Promise.reject('密码需要包含数字+字母');
      }
      break;
    case FaEnums.ConfigSysSafePasswordTypeEnum.NUM_CHAR_SPEC:
      if (noNum || noChar || noSpec) {
        return Promise.reject('密码需要包含数字+字母+特殊字符');
      }
      break;
  }

  return Promise.resolve();
}
