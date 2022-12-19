import React, { createContext, useState } from 'react';
import { ConfigProvider } from 'antd';
// dayjs国际化
import 'dayjs/locale/zh-cn';
// antd国际化配置
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
// i18n国际化
import { IntlProvider } from 'react-intl';
import zhCNMessage from '@/lang/zh_CN';
import enCNMessage from '@/lang/en_US';
import { SmileOutlined } from '@ant-design/icons';
import { Fa } from '@/types';

function handleAntdMessages(lang: string) {
  switch (lang) {
    case 'zh_CN':
      return zhCN;
    case 'en_US':
      return enUS;
    default:
      return zhCN;
  }
}

function handleMessages(lang: string) {
  switch (lang) {
    case 'zh_CN':
      return zhCNMessage;
    case 'en_US':
      return enCNMessage;
    default:
      return zhCNMessage;
  }
}

interface CProps {
  locale: string;
  setLocale: (locale: string) => void;
}

export const LangContext = createContext<CProps>({
  locale: 'zh_CN',
  setLocale: () => {
    console.log('LangContext.setLocale');
  },
});

// 全局表单提示校验
const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: "'${label}' 是必选字段",
};

// 自定义Empty组件内容
const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <SmileOutlined style={{ fontSize: 20 }} />
    <div>暂无数据</div>
  </div>
);

/**
 * 国际化组件
 */
function LangLayout({ children }: Fa.BaseChildProps) {
  const [locale, setLocale] = useState('zh_CN');

  return (
    <LangContext.Provider value={{ locale, setLocale: (v) => setLocale(v) }}>
      <ConfigProvider
        locale={handleAntdMessages(locale)}
        form={{ validateMessages }}
        renderEmpty={customizeRenderEmpty}
        // getPopupContainer={(trigger) => (trigger ? trigger.parentElement : document.body)}
      >
        <IntlProvider messages={handleMessages(locale)} locale={locale.split('_')[0]}>
          {children}
        </IntlProvider>
      </ConfigProvider>
    </LangContext.Provider>
  );
}

export default LangLayout;
