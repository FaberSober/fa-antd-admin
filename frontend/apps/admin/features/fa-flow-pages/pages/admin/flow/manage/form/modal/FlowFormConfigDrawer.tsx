import { flowFormApi } from '@/services';
import { CalculatorOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaHref } from '@fa/ui';
import { FaFormEditor } from '@features/fa-flow-pages/components';
import { Flow } from '@features/fa-flow-pages/types';
import { Button, Drawer, Space, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import FormTableEdit from '../cube/database/FormTableEdit';
import TableShowDesign from '../cube/table/TableShowDesign';
import { useFlowFormEditStore } from '../store/useFlowFormEditStore';

export interface FlowFormConfigDrawerProps {
  item: Flow.FlowForm;
}

/**
 * @author xu.pengfei
 * @date 2025-12-16 16:49:56
 */
export default function FlowFormConfigDrawer({ item }: FlowFormConfigDrawerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('form');
  const { flowForm, setFlowForm, clear } = useFlowFormEditStore()

  useEffect(() => {
    return () => {
      clear()
    }
  }, [item]);

  function handleConfigChange(config: any) {
    // compare with previous config
    if (!isEqual(flowForm?.config, config)) {
      setFlowForm({...flowForm!, config});
      // config changed, update via API
      flowFormApi.update(flowForm!.id, { config }).then(() => {
      });
    }
  }

  function handleOpen() {
    setOpen(true)
    setFlowForm(item)
  }

  return (
    <span>
      <FaHref onClick={() => handleOpen()} text='配置' icon={<CalculatorOutlined />} />
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
        {(open) && flowForm && (
          <>
            <div className="fa-full">
              <div className="fa-full-content fa-flex-column fa-tabs">
                <div>
                  <Tabs
                    items={[
                      { key: 'form', label: '表单设计' },
                      { key: 'database', label: '数据库表' },
                      { key: 'table', label: '列表设计' },
                    ]}
                    activeKey={tab}
                    onChange={setTab}
                  />
                </div>

                <FaFlexRestLayout>
                  {tab === 'form' && (
                    <FaFormEditor
                      flowForm={item}
                      config={item?.config}
                      onChange={handleConfigChange}
                    />
                  )}
                  {tab === 'database' && (
                    <FormTableEdit item={item} />
                  )}
                  {tab === 'table' && (
                    <TableShowDesign />
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
