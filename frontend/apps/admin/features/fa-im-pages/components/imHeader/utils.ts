import dayjs from "dayjs";

/**
 * 格式化聊天会话的最后更新时间
 * @param updTime 最后更新时间字符串
 * @returns 格式化后的时间显示
 */
export function formatConversationTime(updTime?: string): string {
  if (!updTime) return '';

  const now = dayjs();
  const updateTime = dayjs(updTime);

  // 如果是今天，则展示HH:mm
  if (updateTime.isSame(now, 'day')) {
    return updateTime.format('HH:mm');
  }

  // 如果是最近7天，则展示星期几
  if (updateTime.isAfter(now.subtract(7, 'day')) && updateTime.isSame(now, 'year')) {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekdays[updateTime.day()];
  }

  // 如果超过7天但是同一年的，则展示MM-DD
  if (updateTime.isSame(now, 'year')) {
    return updateTime.format('MM-DD');
  }

  // 如果超过7天且不是同一年，则展示YYYY-MM-DD
  return updateTime.format('YYYY-MM-DD');
}
