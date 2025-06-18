import { useContext, useEffect, useState } from 'react';
import type { Layout } from 'react-grid-layout';
import { each } from 'lodash';
import { ApiEffectLayoutContext, FaUtils } from '@fa/ui';
import { configApi } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';
import { Modal } from 'antd';
import MenuLayoutContext from '@features/fa-admin-pages/layout/menu/context/MenuLayoutContext';

/**
 * 解析homecubes类似组件输出全部布局配置
 * @param cubes
 */
export function parseAllLayout(cubes: any) {
  const allLayout: Layout[] = [];
  each(cubes, (k) => {
    allLayout.push({
      i: k.displayName,
      w: k.w,
      h: k.h,
      x: 0,
      y: 0,
    });
  });
  return allLayout;
}

export function useAllLayout(cubes: any): { allLayout: Layout[] } {
  const { menuList } = useContext(MenuLayoutContext);
  const permissions = menuList.map((i) => i.linkUrl);

  const allLayout: Layout[] = [];
  each(cubes, (k) => {
    if (!FaUtils.hasPermission(permissions, k.permission)) {
      return;
    }

    allLayout.push({
      i: k.displayName,
      w: k.w,
      h: k.h,
      x: 0,
      y: 0,
    });
  });

  return { allLayout };
}

export function calAddLayout(cubes: any, layout: Layout[], addId: string) {
  const Component = (cubes as any)[addId];

  let x = 0;
  let y = 0;

  // 循环layout找到摆放位置
  each(layout, (l) => {
    const tryX = l.x + l.w;

    // 已经循环到下一行了，需要从这一行的起始x=0处进行比对
    if (l.y > y) {
      x = 0;
      y = l.y;
    }

    if (tryX + Component.w > 16) {
      // 本行已经摆放不下了，需要摆放到下一行
      x = 0;
      y = l.y + l.h; // y的下一行位置
      return;
    }

    // 本行可以摆的下
    x = tryX;
    y = l.y;
  });

  return [
    ...layout,
    {
      i: Component.displayName,
      w: Component.w,
      h: Component.h,
      x: x,
      y: y,
    },
  ];
}

export function useGridLayoutConfig(cubes: any, biz: string, type: string, defaultLayout: any[]) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const loading = loadingEffect[configApi.getUrl('save')] || loadingEffect[configApi.getUrl('update')];

  const [config, setConfig] = useState<Admin.Config<Layout[]>>();
  const [layout, setLayout] = useState<Layout[]>([]);

  useEffect(() => {
    configApi.getOne(biz, type).then((res) => {
      if (res.data) {
        setLayout(res.data.data);
        setConfig(res.data);
      } else {
        // 未找到，去查找全局是否有配置
        configApi.getOneGlobal(biz, type).then((res1) => {
          setConfig(undefined);
          setLayout(res1.data?.data || defaultLayout);
        });
      }
    });
  }, []);

  function onLayoutChange(layout: Layout[]) {
    // console.log('onLayoutChange', layout)
    if (loading) return;
    const params = {
      biz,
      type,
      data: layout,
    };
    if (config) {
      configApi.update(config.id, { id: config.id, ...params });
    } else {
      configApi.save(params).then((res) => {
        setConfig(res.data);
      });
    }
    setLayout(layout);
  }

  /**
   * 添加item到布局中
   * @param id
   */
  function handleAdd(id: string) {
    const newLayout = calAddLayout(cubes, layout, id);
    setLayout(newLayout);
  }

  function handleDel(id: string) {
    setLayout(layout.filter((i) => i.i !== id));
  }

  function handleSaveCurAsDefault() {
    Modal.confirm({
      title: '确认',
      content: '确认保存当前为默认配置，全局生效？',
      onOk: () => {
        const params = {
          biz,
          type,
          data: layout,
        };
        return configApi.saveGlobal(params).then((res) => FaUtils.showResponse(res, '保存当前为默认配置'));
      },
    });
  }

  function handleClearAllUserConfig() {
    Modal.confirm({
      title: '确认',
      content: '确认清空全部用户缓存？',
      onOk: () => {
        const params = {
          query: { biz, type },
        };
        return configApi.removeByQuery(params).then((res) => FaUtils.showResponse(res, '清空全部用户缓存'));
      },
    });
  }

  return {
    config,
    layout,
    loading,
    onLayoutChange,
    handleAdd,
    handleDel,
    handleSaveCurAsDefault,
    handleClearAllUserConfig,
  };
}
