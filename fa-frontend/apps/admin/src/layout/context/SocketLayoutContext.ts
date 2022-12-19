import { createContext } from 'react';

export interface SocketLayoutContextProps {
  socketInstance: any;
  sendSocketMsg: (event: string, ...args: any[]) => void; // 发送socket信息的方法
}

export default createContext<SocketLayoutContextProps>({
  socketInstance: null,
  sendSocketMsg: () => {},
});
