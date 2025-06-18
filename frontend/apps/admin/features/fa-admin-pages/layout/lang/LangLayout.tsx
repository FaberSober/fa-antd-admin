import React, { useContext, useState } from 'react';
import { ConfigProvider, theme } from 'antd';

// antd国际化配置
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';

// i18n国际化
import { IntlProvider } from 'react-intl';
import zhCNMessage from '@/lang/zh_CN';
import enCNMessage from '@/lang/en_US';
import { SmileOutlined } from '@ant-design/icons';
import { type Fa, ThemeLayoutContext } from '@fa/ui';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import LangContext from './context/LangContext';

dayjs.locale('zh-cn');

function handleAntdMessages(lang: string) {
  dayjs.locale('zh-cn');
  switch (lang) {
    case 'zh_CN':
      return zhCN;
    case 'en_US':
      dayjs.locale('en');
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
export default function LangLayout({ children }: Fa.BaseChildProps) {
  const { colorPrimary, themeDark } = useContext(ThemeLayoutContext);
  const [locale, setLocale] = useState('zh_CN');

  return (
    <LangContext.Provider
      value={{
        locale,
        setLocale: (v) => setLocale(v),
      }}
    >
      <ConfigProvider
        locale={handleAntdMessages(locale)}
        form={{ validateMessages }}
        renderEmpty={customizeRenderEmpty}
        theme={{
          algorithm: themeDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            borderRadius: 3,
            colorPrimary: colorPrimary,
            colorBgContainer: themeDark ? 'var(--fa-bg-color)' : '#FFF',
          },
          components: {
            Segmented: {
              trackBg: themeDark ? '#000' : '#e1e1e1',
            },
          },
        }}
        // getPopupContainer={(trigger) => (trigger ? trigger.parentElement as HTMLElement : document.body)}
      >
        <IntlProvider messages={handleMessages(locale)} locale={locale.split('_')[0]}>
          {children}
        </IntlProvider>
      </ConfigProvider>
    </LangContext.Provider>
  );
}
