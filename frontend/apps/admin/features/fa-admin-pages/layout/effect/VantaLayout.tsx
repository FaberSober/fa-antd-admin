import React, { type CSSProperties, useContext, useEffect, useRef } from 'react';
import { trim } from 'lodash';
import { type Fa, fileSaveApi } from '@fa/ui';
import styles from './VantaLayout.module.scss';
import ConfigLayoutContext from '../config/context/ConfigLayoutContext';
// import * as THREE from 'three';

/**
 * @author xu.pengfei
 * @date 2023/2/6 10:26
 */
export default function VantaLayout({ children }: Fa.BaseChildProps) {
  const vantaRef = useRef<any>();
  const { systemConfig } = useContext(ConfigLayoutContext);

  useEffect(() => {
    if (systemConfig === undefined) return;
    // 表示有背景图片
    if (trim(systemConfig.loginBg) !== '') return;

    // 使用vanta制作背景效果图
    // const vantaEffect = window.VANTA.WAVES({
    //   el: vantaRef.current,
    //   // FIXME: 高版本会崩溃：https://github.com/tengbao/vanta/issues/177
    //   THREE: THREE, // use a custom THREE when initializing
    //   mouseControls: true,
    //   touchControls: true,
    //   gyroControls: false,
    //   minHeight: 200.0,
    //   minWidth: 200.0,
    //   scale: 1.0,
    //   scaleMobile: 1.0,
    //   zoom: 0.79,
    // });
    // return () => {
    //   if (vantaEffect) vantaEffect.destroy();
    // };
  }, [systemConfig]);

  const bgStyle: CSSProperties = {
    background: systemConfig.loginBg ? `url(${fileSaveApi.genLocalGetFile(systemConfig.loginBg)}) no-repeat` : 'url(/file/image/bg/login.png) no-repeat',
    backgroundSize: '100% 100%',
  };
  // console.log(bgStyle)

  return (
    <div ref={vantaRef} className={styles['main-container']}>
      <div className="fa-full-content" style={bgStyle}>
        {/* left title info */}
        <div className={styles.bannerDiv}>
          <div>
            <div className={styles.bannerTitle} style={{ color: systemConfig.titleColor }}>
              {systemConfig?.title || '-'}
            </div>
            <div className={styles.bannerSubTitle} style={{ color: systemConfig.subTitleColor }}>
              {systemConfig?.subTitle || '-'}
            </div>
            <div style={{ width: 1, height: 260 }} />
          </div>
        </div>

        {/* right panel slot */}
        <div className={styles.mainDiv}>
          <div className={styles.main}>{children}</div>
        </div>

        {/* bottom copyright */}
        <div className={styles.footerDiv}>
          <div className={styles.footerMain} style={{ color: systemConfig.copColor }}>
            {systemConfig?.cop}
          </div>
        </div>
      </div>
    </div>
  );
}
