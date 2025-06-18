import { createContext } from 'react';

export interface LangContextProps {
  locale: string;
  setLocale: (locale: string) => void;
}

const LangContext = createContext<LangContextProps>({
  locale: 'zh_CN',
  setLocale: () => {
    console.log('LangContext.setLocale');
  },
});

export default LangContext;
