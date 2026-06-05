import React, { useState } from 'react';
import * as cubes from '@/cubes/monitorcubes';
import { Button, FloatButton, Space } from 'antd';
import { BaseDrawer, FaFlashCard, FaUtils } from '@fa/ui';
import { EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import ExportAndImportBtn from '@features/fa-admin-pages/components/utils/ExportAndImportBtn';
import { FaGridLayout } from '@features/fa-admin-pages/components/grid/FaGridLayout';
import { FaGridLayoutUtils } from '@features/fa-admin-pages/components/utils';
import FaCubeGrid from '@features/fa-admin-pages/components/cube/FaCubeGrid';

const biz = 'MONITOR_LAYOUT';
const type = 'LAYOUT';

/**
 * 监控页
 * @author xu.pengfei
 * @date 2023/1/3 16:13
 */
export default function Monitor() {
  const { layout, onLayoutChange, handleAdd, handleDel, handleSaveCurAsDefault, handleClearAllUserConfig } = FaGridLayoutUtils.useGridLayoutConfig(
    cubes,
    biz,
    type,
    [],
  );

  const { allLayout } = FaGridLayoutUtils.useAllLayout(cubes as any);
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const inIds: string[] = layout.map((i) => i.i);

  return (
    <div className="fa-full-content-p12">
      <FaGridLayout
        layout={layout}
        renderItem={(i) => {
          const Component = (cubes as any)[i.i];
          if (Component) {
            return (
              <FaFlashCard title={Component.title} titleRender={Component.titleRender} hideTitle={!Component.showTitle}>
                <Component />
              </FaFlashCard>
            );
          }
          return <FaFlashCard>Component {i.i} Not Found</FaFlashCard>;
        }}
        onLayoutChange={onLayoutChange}
        rowHeight={20}
        cols={24}
        isDraggable={editing}
        isResizable={editing}
      />
      <div style={{ height: 12, width: '100%' }} />

      <BaseDrawer open={open} title="添加组件" bodyStyle={{ padding: 0 }} onClose={() => setOpen(false)}>
        <Space className="fa-p12" wrap>
          <Button onClick={() => onLayoutChange([])}>清空</Button>
          <Button onClick={handleSaveCurAsDefault}>保存当前为默认</Button>
          <Button onClick={handleClearAllUserConfig} danger>清空全部用户缓存</Button>
          <ExportAndImportBtn filename="监控页" layout={FaUtils.tryFormatJson(JSON.stringify(layout))} onUpload={(v) => onLayoutChange(JSON.parse(v))} />
        </Space>
        <FaCubeGrid
          allLayout={allLayout}
          cubes={cubes as any}
          selectedIds={inIds}
          onAdd={handleAdd}
          onRemove={handleDel}
        />
      </BaseDrawer>

      <FloatButton.Group shape="square">
        <FloatButton icon={<PlusOutlined />} onClick={() => setOpen(true)} />
        <FloatButton onClick={() => setEditing(!editing)} icon={editing ? <SaveOutlined /> : <EditOutlined />} />
      </FloatButton.Group>
    </div>
  );
}
