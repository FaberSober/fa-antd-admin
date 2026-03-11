// WebSocketBridge.tsx (新增文件)
import React, { useEffect } from 'react';
import { useInterval, useWebSocket } from 'ahooks';
import { ReadyState } from 'ahooks/lib/useWebSocket';
import { Fa, FaUtils, getToken } from '@fa/ui';
import { dispatch } from 'use-bus';
import { useWsStore } from './stores/useWsStore';

/**
 * 负责调用所有 Hooks，并将 Hooks 的方法和状态结果同步到 Zustand Store 中。
 */
export default function WebSocketLayout({ children }: Fa.BaseChildProps) {
    // 1. 获取 Zustand 的设置方法
    const setHandlers = useWsStore(state => state.setHandlers);

    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

    // 2. 在组件顶级作用域调用 Hooks (这是合法的)
    const { readyState, sendMessage, latestMessage, disconnect, connect } = useWebSocket(
        wsProtocol + '://' + window.location.host + `/api/websocket/base/${getToken()}`,
        {
            manual: true,
            // 实时更新 Zustand 中的 readyState
            onOpen: () => useWsStore.setState({ readyState: ReadyState.Open }),
            onClose: () => useWsStore.setState({ readyState: ReadyState.Closed }),
            // ... 其他 Ahooks 配置
        }
    );

    // 3. 将 Hooks 提供的实际操作方法注入到 Zustand Store
    useEffect(() => {
        setHandlers({ sendMessage, connect, disconnect });
        // 首次挂载时尝试连接（如果你希望自动连接）
        connect();
    }, [sendMessage, connect, disconnect, setHandlers]);

    // 4. 监听消息变化和解析逻辑 (Hooks 监听)
    useEffect(() => {
        if (!latestMessage?.data) return;

        try {
            const ret = FaUtils.tryParseJson(latestMessage.data, {});

            // 更新 Zustand Store 中的状态
            useWsStore.setState(state => ({ // 使用静态方法来避免触发本组件渲染
                latestMessageObj: ret,
                messageHistory: state.messageHistory.concat(latestMessage),
            }));

            // 保持通过 use-bus 分发事件的逻辑
            const { type, channel, code, msg, data, timestamp } = ret;
            dispatch({ type: `@@ws/RECEIVE/${type}`, payload: data, channel, code, msg, timestamp });

        } catch (e) {
            console.error(e);
        }
    }, [latestMessage]);

    // 5. 心跳和重连逻辑 (Hooks 监听)
    useInterval(() => {
        if (readyState === ReadyState.Closed) {
            connect();
        }
        // 发送心跳包
        try {
            sendMessage('ping');
        } catch (e) {
            console.log('Heartbeat error: ', e);
        }
    }, 10000);

    // Bridge 组件不需要渲染任何 UI
    return (<>{children}</>);
}
