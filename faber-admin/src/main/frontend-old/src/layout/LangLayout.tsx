import React, { createContext, ReactNode, useState } from 'react';
// antd国际化配置
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';
// dayjs国际化
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
// i18n国际化
import { IntlProvider } from 'react-intl';
import zhCNMessage from '@/lang/zh_CN';
import enCNMessage from '@/lang/en_US';
import dayjs from 'dayjs';
import { SmileOutlined } from '@ant-design/icons';

function handleAntdMessages(lang: string) {
  switch (lang) {
    case 'zh_CN':
      dayjs.locale('zh-cn'); // 全局使用
      return zhCN;
    case 'en_US':
      dayjs.locale('en'); // 全局使用
      return enUS;
    default:
      dayjs.locale('zh-cn'); // 全局使用
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

export const LangContext = createContext<CProps>({ locale: 'zh_CN', setLocale: () => {} });

interface IProps {
  children?: ReactNode | Element;
}

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
function LangLayout({ children }: IProps) {
  const [locale, setLocale] = useState('zh_CN');

  return (
    <LangContext.Provider value={{ locale, setLocale: (v) => setLocale(v) }}>
      <ConfigProvider
        locale={handleAntdMessages(locale)}
        form={{ validateMessages }}
        renderEmpty={customizeRenderEmpty}
        // @ts-ignore
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
