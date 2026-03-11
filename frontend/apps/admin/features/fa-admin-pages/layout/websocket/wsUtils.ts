import { useWsStore } from "./stores/useWsStore";

/**
 * 定义一个更通用的发送函数，用于其他类型
 * @param type 消息类型
 * @param data 消息数据体
 */
export function sendMessage(msg: any) {
  // ⭐ 优化点：直接使用静态方法调用
  useWsStore.getState().sendMessage(msg);
}
