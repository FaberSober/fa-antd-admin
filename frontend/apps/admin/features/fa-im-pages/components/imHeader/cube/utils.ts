import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

/**
 * 格式化聊天消息时间
 * @param time 时间字符串
 * @param lastTime 上一条消息时间，用于判断是否需要展示时间
 */
export function formatChatTime(time: string, lastTime?: string): string | null {
  const now = dayjs();
  const msgTime = dayjs(time);

  // 如果与上一条消息时间小于10分钟，不显示
  if (lastTime && dayjs(time).diff(dayjs(lastTime), 'm') < 10) {
    return null;
  }

  // 10分钟内
  if (now.diff(msgTime, 'm') < 10) {
    return null;
  }

  // 今天内
  if (now.format('YYYY-MM-DD') === msgTime.format('YYYY-MM-DD')) {
    return msgTime.format('HH:mm');
  }

  // 7天内
  if (now.diff(msgTime, 'day') <= 7) {
    return msgTime.format('dddd HH:mm');
  }

  // 一年内
  if (now.format('YYYY') === msgTime.format('YYYY')) {
    return msgTime.format('MM-DD HH:mm');
  }

  // 超过一年
  return msgTime.format('YYYY-MM-DD HH:mm');
}
