import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {trim} from 'lodash';
import {message} from 'antd';
import {UserLayoutContext} from "@/layout/UserLayout";
import {getToken} from "@/utils/cache";


export interface Props {
  query?: any;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export interface Ret {
	ready: boolean;
	socketInstance: any;
	/**
	 * 发送事件
	 * @param event
	 * @param args
	 */
	socketEmit: (event: string, ...args: any[]) => void;
}

/**
 * 与服务端的长链接socket.io
 * @author xu.pengfei
 * @date 2021/3/20
 */
export default function useSocketIO({query = { from: 'web', token: getToken() }, onConnect, onDisconnect}: Props): Ret {
  const {systemConfig} = useContext(UserLayoutContext)
	const socketRef = useRef<any>();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (trim(systemConfig.socketUrl) === '') return;
		socketRef.current = window.io(systemConfig.socketUrl, {
			query,
			transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
		});
		socketRef.current?.on('connect', () => {
			console.log('连接成功');
			if (onConnect) onConnect();
		});
		socketRef.current?.on('disconnect', () => {
			console.log('已下线!');
      if (onDisconnect) onDisconnect();
		});
		setReady(true);
		return () => {
			console.log('useSocketIO detach!!!');
			socketRef.current?.disconnect();
		};
	}, [systemConfig.socketUrl]);

	const socketEmit = useCallback(
		(event: string, ...args: any[]) => {
			if (!ready) {
				message.error('socket接口尚未准备好，请稍等');
				return;
			}
			// console.log('socketEmit', socketRef.current);
			socketRef.current?.emit(event, ...args);
		},
		[ready, systemConfig.socketUrl],
	);

	return { ready, socketEmit, socketInstance: socketRef.current };
}
