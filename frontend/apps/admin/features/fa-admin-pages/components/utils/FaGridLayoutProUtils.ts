import type { Admin } from '@/types';
import { FaUtils, useApiLoading } from '@fa/ui';
import MenuLayoutContext from '@features/fa-admin-pages/layout/menu/context/MenuLayoutContext';
import { configApi } from '@features/fa-admin-pages/services';
import { Modal } from 'antd';
import { each, find } from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import type { Layout } from 'react-grid-layout';

/**
 * HelloBanner.displayName = 'HelloBanner'; // 必须与方法名称一致
HelloBanner.title = '欢迎';
HelloBanner.description = '欢迎组件';
HelloBanner.showTitle = false; // 是否展示Card的Title
HelloBanner.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
HelloBanner.w = 24; // 宽度-网格-max=24
HelloBanner.h = 3; // 高度-每个单位20px
 */
export interface CubeItem {
  displayName: string;
  title: string;
  description: string;
  showTitle: boolean;
  permission?: string;
  w: number;
  h: number;
}

/**
 * react-grid-layout 的 layout[i] 必须唯一，而业务里 同一种 widget 可以被展示多次（比如同一个图表组件实例化多个）。
🔑 解决方案思路
1. widget 定义（模板） 和 widget 实例 区分开。
  - 模板：描述一种组件类型（chart/table/map…）。
  - 实例：用户拖到 dashboard 上的一个具体 widget，带唯一 ID。
2. 生成唯一 i
  - 每个 widget 实例必须有唯一 ID，比如用 UUID 或者 递增计数器。
  - 这个 ID 作为 layout.i，并且绑定到业务数据上。
3. 存储时
  - 存储 {id, type, config, layout}。
  - 下次加载时直接还原。

📦 保存到后端的数据结构
```json
[
  {
    "id": "4c29c73f-3d2d-4f08-8a18-94c93c2a4d12",
    "type": "chart",
    "title": "温度曲线",
    "layout": { "i": "4c29c73f-3d2d-4f08-8a18-94c93c2a4d12", "x": 0, "y": 0, "w": 4, "h": 3 }
  },
  {
    "id": "8d82f530-2b13-4a10-882e-47b207eecf75",
    "type": "chart",
    "title": "温度曲线",
    "layout": { "i": "8d82f530-2b13-4a10-882e-47b207eecf75", "x": 4, "y": 0, "w": 4, "h": 3 }
  },
  {
    "id": "3b2d4d10-2d01-42cc-9a71-4e6d3efb8a6e",
    "type": "table",
    "title": "设备表",
    "layout": { "i": "3b2d4d10-2d01-42cc-9a71-4e6d3efb8a6e", "x": 8, "y": 0, "w": 4, "h": 3 }
  }
]
```
 */
export interface Widget {
  id: string;       // 实例唯一 ID
  displayName: string;     // widget 类型
  title: string;
  config?: any;
  layout: Layout;
}

/**
 * 解析homecubes类似组件输出全部布局配置
 * @param cubes
 */
export function parseAllLayout(cubes: CubeItem[]) {
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

export function useAllLayout(cubes: CubeItem[]): { allLayout: Layout[] } {
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

export function calAddLayout(cubes: CubeItem[], layout: Layout[], displayName: string): Layout {
  const Component = find(cubes, c => c.displayName === displayName) as CubeItem;

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

  return {
    i: FaUtils.uuid(),
    w: Component.w,
    h: Component.h,
    x: x,
    y: y,
  };
}

export function useGridLayoutConfig(cubes: any, biz: string, type: string, defaultWidget: Widget[]) {
  const loading = useApiLoading([ configApi.getUrl('save'), configApi.getUrl('update')]);

  const [config, setConfig] = useState<Admin.Config<Widget[]>>();
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const layout = useMemo(() => {
    return widgets.map(i => i.layout)
  }, [widgets])

  useEffect(() => {
    configApi.getOne(biz, type).then((res) => {
      if (res.data) {
        setWidgets(res.data.data.widgets || []);
        setConfig(res.data);
      } else {
        // 未找到，去查找全局是否有配置
        configApi.getOneGlobal(biz, type).then((res1) => {
          setConfig(undefined);
          const dw = res1.data?.data.widgets || defaultWidget
          setWidgets(dw);
        });
      }
    });
  }, []);

  function updateConfig(widgets: Widget[]) {
    const params = {
      biz,
      type,
      data: { widgets },
    };
    configApi.save(params).then((res) => {
      setConfig(res.data);
    });
  }

  function onLayoutChange(layout: Layout[]) {
    console.log('onLayoutChange', layout)
    if (loading) return;
    const newWidgets = widgets.map(w => {
      const newLayout = find(layout, (l: Layout) => l.i === w.id) as Layout
      return { ...w, layout: newLayout }
    })
    updateConfig(newWidgets);
    setWidgets(newWidgets);
  }

  function handleWidgetChange(newWidgets: Widget[]) {
    updateConfig(newWidgets);
    setWidgets(newWidgets);
  }

  /**
   * 添加item到布局中
   * @param id
   */
  function handleAdd(displayName: string) {
    const Component = find(cubes, c => c.displayName === displayName) as CubeItem;
    const newLayout = calAddLayout(cubes, layout, displayName);
    const newWidget = {
      id: newLayout.i,
      displayName: Component.displayName,
      title: Component.title,
      layout: newLayout,
      config: {},
    }
    console.log('newWidget', newWidget)
    setWidgets(prev => ([ ...prev, newWidget ]));
  }

  function handleDel(id: string) {
    setWidgets(prev => {
      const newWidgets = prev.filter((i) => i.id !== id)
      updateConfig(newWidgets)
      return newWidgets
    });
  }

  function handleSaveCurAsDefault() {
    Modal.confirm({
      title: '确认',
      content: '确认保存当前为默认配置，全局生效？',
      onOk: () => {
        const params = {
          biz,
          type,
          data: {
            widgets
          },
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
    widgets,
    setWidgets,
    loading,
    onLayoutChange,
    handleWidgetChange,
    handleAdd,
    handleDel,
    handleSaveCurAsDefault,
    handleClearAllUserConfig,
  };
}
