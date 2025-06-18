import React, { type ReactNode, useContext, useEffect } from 'react';
import SocketLayoutContext, { type SocketLayoutContextProps } from './context/SocketLayoutContext';
import { UserLayoutContext } from '../user/context/UserLayoutContext';
import useSocketIO from '@features/fa-admin-pages/hooks/useSocketIO';

export interface SocketLayoutProps {
  children?: ReactNode | Element;
}

/**
 * Socket长连接Container
 * @author xu.pengfei
 * @date 2021/11/11 14:43
 */
export default function SocketLayout({ children }: SocketLayoutProps) {
  const { user } = useContext(UserLayoutContext);
  // const { ready, socketEmit, socketInstance } = useSocketIO(systemConfig.socketServer)
  const { ready, socketEmit, socketInstance } = useSocketIO({});

  useEffect(() => {
    if (!ready) return;
    if (user.id === '0') return;
    if (socketInstance === undefined) return;

    console.log('socketInstance', socketInstance);
    socketInstance.emit('login', { userId: user.id });
  }, [ready, user, socketInstance]);

  const contextValue: SocketLayoutContextProps = {
    socketInstance,
    sendSocketMsg: socketEmit,
  };

  return <SocketLayoutContext.Provider value={contextValue}>{children}</SocketLayoutContext.Provider>;
}
