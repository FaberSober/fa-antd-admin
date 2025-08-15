import React, { createContext, useEffect } from 'react';
import { Fa } from '@ui/types';
import { useLocalStorage } from "react-use";
import { each } from "lodash";
import chroma from 'chroma-js';


const DEFAULT_PRIMARY_COLOR = '#1890FF';

export interface ThemeLayoutContextProps {
  colorPrimary: string;
  setColorPrimary: (color: string) => void;
  themeDark: boolean;
  setThemeDark: (dark: boolean) => void;
}

export const ThemeLayoutContext = createContext<ThemeLayoutContextProps>({
  colorPrimary: DEFAULT_PRIMARY_COLOR,
  setColorPrimary: () => {},
  themeDark: false,
  setThemeDark: () => {},
});


const ThemeConfig = {
  light: {
    'fa-bg-color': '#fff',
    'fa-bg-color1': '#e1e1e1',
    'fa-bg-color2': '#eee',
    'fa-bg-selected': '#e3e3e3',
    'fa-bg-color-hover': '#F0F0F0',
    'fa-bg-color-highlight': '#3c4c68',
    'fa-bg-grey': '#f7f7f7',
    'fa-bg-grey2': '#e7e7e7',
    'fa-bg-menu': '#F2F7FF',
    'fa-hover-bg': '#e1e1e1',
    'fa-text-color': '#353535',
    'fa-text-color2': '#353535',
    'fa-text-color-hover': '#353535',
    'fa-text-color-light100': '#999',
    'fa-text-color-disable': 'rgba(0, 0, 0, 0.25)',
    'fa-subtitle-color': '#666',
    'fa-border-color': '#F0F0F0',
    'separator-border': '#eee',
  },
  dark: {
    'fa-bg-color': '#151921',
    'fa-bg-color1': '#1F1F1F',
    'fa-bg-color2': '#2F2F2F',
    'fa-bg-selected': '#3c4c68',
    'fa-bg-color-hover': '#262b33',
    'fa-bg-color-highlight': '#1c5e88',
    'fa-bg-grey': '#53626c',
    'fa-bg-grey2': '#1F1F1F',
    'fa-bg-menu': '#3c4c68',
    'fa-hover-bg': '#1c5e88',
    'fa-text-color': '#FFF',
    'fa-text-color2': '#eee',
    'fa-text-color-hover': '#FFF',
    'fa-text-color-light100': '#aaa',
    'fa-text-color-disable': 'rgba(255, 255, 255, 0.25)',
    'fa-subtitle-color': '#A5C9E6',
    'fa-border-color': '#2f3a4b',
    'separator-border': '#0A3046',
  },
}

export interface ThemeLayoutProps extends Fa.BaseChildProps {
  colorPrimary?: string;
  initThemeDark?: boolean;
}

/**
 * @author xu.pengfei
 * @date 2022/9/21
 */
export default function ThemeLayout({ children, colorPrimary, initThemeDark }: ThemeLayoutProps) {
  const [colorPrimaryInner, setColorPrimaryInner] = useLocalStorage<string>('colorPrimary', colorPrimary || DEFAULT_PRIMARY_COLOR);
  const [themeDark, setThemeDark] = useLocalStorage<boolean>('themeDark', document.body.getAttribute('data-theme') === 'dark' || initThemeDark);


  useEffect(() => {
    const rootDom = document.getElementsByTagName('html')[0].style;
    rootDom.setProperty('--primary-color', colorPrimaryInner!);

    // calculate primary color variants - use chroma-js
    const colorPrimary = chroma(colorPrimaryInner!);
    if (themeDark) {
      rootDom.setProperty('--primary-color-dark100', colorPrimary.brighten(0.5).hex());
      rootDom.setProperty('--primary-color-dark200', colorPrimary.brighten(1.0).hex());
      rootDom.setProperty('--primary-color-dark300', colorPrimary.brighten(1.5).hex());
      rootDom.setProperty('--primary-color-dark400', colorPrimary.brighten(2.0).hex());

      rootDom.setProperty('--primary-color-light100', colorPrimary.darken(0.5).hex());
      rootDom.setProperty('--primary-color-light200', colorPrimary.darken(1.0).hex());
      rootDom.setProperty('--primary-color-light300', colorPrimary.darken(1.5).hex());
      rootDom.setProperty('--primary-color-light400', colorPrimary.darken(2.0).hex());
    } else {
      rootDom.setProperty('--primary-color-dark100', colorPrimary.darken(0.5).hex());
      rootDom.setProperty('--primary-color-dark200', colorPrimary.darken(1.0).hex());
      rootDom.setProperty('--primary-color-dark300', colorPrimary.darken(1.5).hex());
      rootDom.setProperty('--primary-color-dark400', colorPrimary.darken(2.0).hex());

      rootDom.setProperty('--primary-color-light100', colorPrimary.brighten(0.5).hex());
      rootDom.setProperty('--primary-color-light200', colorPrimary.brighten(1.0).hex());
      rootDom.setProperty('--primary-color-light300', colorPrimary.brighten(1.5).hex());
      rootDom.setProperty('--primary-color-light400', colorPrimary.brighten(2.0).hex());
    }

    changeTheme(themeDark);
  }, [colorPrimaryInner, themeDark]);

  function changeTheme(dark: boolean|undefined) {
    const themeData:any = dark ? 'dark' : 'light';
    const htmlDom = document.getElementsByTagName('html')[0]
    document.body.setAttribute('data-theme', themeData); // 设置tailwindcss主题
    htmlDom.setAttribute('data-theme', themeData); // 设置tailwindcss主题

    const rootDom = document.getElementsByTagName('html')[0].style;

    //console.log('themeData', themeData)
    each(ThemeConfig.light, (_v, k) => {
      // @ts-ignore
      rootDom.setProperty(`--${k}`, ThemeConfig[themeData][k]);
    })
  }

  const contextValue: ThemeLayoutContextProps = {
    colorPrimary: colorPrimaryInner || DEFAULT_PRIMARY_COLOR,
    setColorPrimary: (v) => setColorPrimaryInner(v),
    themeDark: themeDark || false,
    setThemeDark: (dark: boolean) => {
      setThemeDark(dark);
      changeTheme(dark);
    },
  };

  return <ThemeLayoutContext.Provider value={contextValue}>{children}</ThemeLayoutContext.Provider>;
}
