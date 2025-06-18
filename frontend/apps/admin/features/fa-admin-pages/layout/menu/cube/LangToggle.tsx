import React, { useContext } from 'react';
import { TranslationOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import LangContext from '../../lang/context/LangContext';

/**
 * 语言国际化切换组件
 */
export default function LangToggle() {
  const { locale, setLocale } = useContext(LangContext);

  function handleChangeLocale() {
    const newValue = locale === 'zh_CN' ? 'en_US' : 'zh_CN';
    setLocale(newValue);
  }

  return (
    <div style={{ cursor: 'pointer', fontSize: '14px', color: '#eee', margin: '0 12px' }} onClick={handleChangeLocale}>
      <TranslationOutlined style={{ marginRight: 6 }} />
      <FormattedMessage id="navbar.lang" />
    </div>
  );
}
