import {useCallback, useEffect, useRef, useState} from 'react';
import {trim} from 'lodash';
import {message} from 'antd';

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
export default function useSocketIO(socketServer: string, query: any = { from: 'web' }): Ret {
	const socketRef = useRef<any>();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (trim(socketServer) === '') return;
		socketRef.current = window.io(socketServer, {
			query,
			transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
		});
		socketRef.current?.on('connect', () => {
			console.log('连接成功');
		});
		socketRef.current?.on('disconnect', () => {
			console.log('已下线!');
		});
		setReady(true);
		return () => {
			console.log('useSocketIO detach!!!');
			socketRef.current?.disconnect();
		};
	}, [socketServer]);

	const socketEmit = useCallback(
		(event: string, ...args: any[]) => {
			if (!ready) {
				message.error('socket接口尚未准备好，请稍等');
				return;
			}
			// console.log('socketEmit', socketRef.current);
			socketRef.current?.emit(event, ...args);
		},
		[ready, socketServer],
	);

	return { ready, socketEmit, socketInstance: socketRef.current };
}
