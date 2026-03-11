import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

export const disabledFutureDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf('day');
};

export const disabledPastDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

/**
 * 将秒转换为人性化的时间字符串
 * @param seconds 秒数
 * @returns 格式化的时间字符串
 */
export function formatDuration(seconds: number, units = ['天', '小时', '分钟', '秒']): string {
  if (seconds < 60) {
    return `${seconds}秒`;
  }

  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}${units[0]}`);
  }
  if (hours > 0) {
    parts.push(`${hours}${units[1]}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}${units[2]}`);
  }
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds}${units[3]}`);
  }

  return parts.join('');
}
