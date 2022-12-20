import { createContext } from 'react';

export interface FaUiContextProps {
  permissions: string[]; // 用户菜单权限列表
  // setPermissions: (v: string[]) => void;
}

const FaUiContext = createContext<FaUiContextProps>({
  permissions: [],
  // setPermissions: (v: string[]) => {},
});

export default FaUiContext;
