const UPDATE_DEVICE_ID_KEY = 'fa.mobile.update.device-id';

export function getUpdateDeviceId(): string {
  try {
    const stored = uni.getStorageSync(UPDATE_DEVICE_ID_KEY);
    if (typeof stored === 'string' && stored.trim()) return stored;
  } catch {
    // 更新检查仍可继续，存储异常时使用本次生成的标识。
  }

  const deviceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
  try {
    uni.setStorageSync(UPDATE_DEVICE_ID_KEY, deviceId);
  } catch {
    // 更新检查仍可继续，存储异常时不阻断业务。
  }
  return deviceId;
}
