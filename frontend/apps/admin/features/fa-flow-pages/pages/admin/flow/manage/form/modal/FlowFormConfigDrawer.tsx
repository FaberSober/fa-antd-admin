import { flowFormApi } from '@/services';
import { CalculatorOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaHref } from '@fa/ui';
import { FaFormEditor } from '@features/fa-flow-pages/components';
import { Flow } from '@features/fa-flow-pages/types';
import { Button, Drawer, Space, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import FormTableEdit from '../cube/FormTableEdit';

export interface FlowFormConfigDrawerProps {
  item: Flow.FlowForm;
}

/**
 * @author xu.pengfei
 * @date 2025-12-16 16:49:56
 */
export default function FlowFormConfigDrawer({ item }: FlowFormConfigDrawerProps) {
  const [open, setOpen] = useState(false);
  const [itemClone, setItemClone] = useState(item);
  const [tab, setTab] = useState('database');

  useEffect(() => {
    setItemClone(item);
  }, [item]);

  function handleConfigChange(config: any) {
    // compare with previous config
    if (!isEqual(itemClone.config, config)) {
      setItemClone({...itemClone, config});
      // config changed, update via API
      flowFormApi.update(itemClone.id, { config }).then(() => {
      });
    }
  }

  return (
    <span>
      <FaHref onClick={() => setOpen(true)} text='配置' icon={<CalculatorOutlined />} />
      <Drawer
        title="配置表单"
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        size={window.document.body.clientWidth}
        resizable
        extra={(
          <Space>
            <Button type="primary" size="small" onClick={() => setOpen(false)}>保存</Button>
          </Space>
        )}
      >
        {(open) && (
          <>
            <div className="fa-full">
              <div className="fa-full-content fa-flex-column fa-tabs">
                <div>
                  <Tabs
                    items={[
                      { key: 'database', label: '数据库' },
                      { key: 'form', label: '表单配置' },
                    ]}
                    activeKey={tab}
                    onChange={setTab}
                  />
                </div>

                <FaFlexRestLayout>
                  {tab === 'database' && (
                    <FormTableEdit item={item} />
                  )}
                  {tab === 'form' && (
                    <FaFormEditor
                      config={itemClone?.config}
                      onChange={handleConfigChange}
                    />
                  )}
                </FaFlexRestLayout>
              </div>
            </div>
          </>
        )}
      </Drawer>
    </span>
  );
}
