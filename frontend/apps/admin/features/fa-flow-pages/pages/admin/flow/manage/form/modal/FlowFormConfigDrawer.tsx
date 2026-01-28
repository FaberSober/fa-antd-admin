import { flowFormApi } from '@/services';
import { CalculatorOutlined, DatabaseOutlined, FormOutlined, OrderedListOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaHref } from '@fa/ui';
import { FaFormEditor } from '@features/fa-flow-pages/components';
import { Button, Drawer, Segmented, Space, Tabs } from 'antd';
import { debounce, isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import FormTableEdit from '../cube/database/FormTableEdit';
import TableShowDesign from '../cube/table/TableShowDesign';
import { useFlowFormEditStore } from '../store/useFlowFormEditStore';


export interface FlowFormConfigDrawerProps {
  itemId: number;
  refresh?: () => void;
}

/**
 * @author xu.pengfei
 * @date 2025-12-16 16:49:56
 */
export default function FlowFormConfigDrawer({ itemId, refresh }: FlowFormConfigDrawerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('form');
  const { flowForm, setFlowForm, clear } = useFlowFormEditStore()

  useEffect(() => {
    if (open) {
      flowFormApi.getById(itemId).then((res) => {
        setFlowForm(res.data);
      });
    }
    return () => {
      clear()
    }
  }, [itemId]);

  // 1. 创建一个防抖的 API 更新函数
  const debouncedApiUpdate = useMemo(
    () =>
      debounce((id: number, config: any) => {
        flowFormApi.update(id, { config }).then(() => {
          console.log('API updated');
        });
      }, 1000), // 设置 1 秒延迟
    []
  );

  // 2. 在组件销毁时，取消防抖任务，防止内存泄漏或异常回调
  useEffect(() => {
    return () => debouncedApiUpdate.cancel();
  }, [debouncedApiUpdate]);

  function handleConfigChange(config: any) {
    if (!flowForm) return;
    // compare with previous config
    if (!isEqual(flowForm?.config, config)) {
      // A. 立即更新本地 State，确保拖拽和输入框不卡顿
      setFlowForm({...flowForm!, config});

      // B. 触发防抖 API 调用
      // 注意：这里需要显式传入 id 和 config，不要直接在 debounce 内部闭包引用 flowForm
      debouncedApiUpdate(flowForm.id, config);
    }
  }

  function handleOpen() {
    setOpen(true)
    flowFormApi.getById(itemId).then((res) => {
      setFlowForm(res.data);
    });
  }

  return (
    <span>
      <FaHref onClick={() => handleOpen()} text='配置' icon={<CalculatorOutlined />} />
      <Drawer
        title="配置表单"
        open={open}
        onClose={() => {
          setOpen(false)
          clear()
          refresh && refresh()
        }}
        size={window.document.body.clientWidth}
        resizable
        extra={(
          <Space>
            <Button type="primary" size="small" onClick={() => setOpen(false)}>保存</Button>
          </Space>
        )}
        styles={{
          body: {
            background: 'var(--fa-bg-grey3)',
          }
        }}
        push={false}
      >
        {(open) && flowForm && (
          <>
            <div className="fa-full">
              <div className="fa-full-content fa-p12 fa-bg-grey fa-flex-column fa-tabs">
                <div style={{position: 'fixed', top: 7, left: 'calc(50vw - 146px)' }}>
                  <Segmented
                    options={[
                      { value: 'form', label: <span><FormOutlined style={{marginRight: 4}} />表单设计</span> },
                      { value: 'database', label: <span><DatabaseOutlined style={{marginRight: 4}} />数据库表</span> },
                      { value: 'table', label: <span><OrderedListOutlined style={{marginRight: 4}} />列表设计</span> },
                    ]}
                    value={tab}
                    onChange={setTab}
                  />
                </div>

                <FaFlexRestLayout style={{ overflow: 'hidden' }}>
                  {tab === 'form' && (
                    <FaFormEditor
                      flowForm={flowForm}
                      config={flowForm?.config}
                      onChange={handleConfigChange}
                    />
                  )}
                  {tab === 'database' && (
                    <FormTableEdit item={flowForm} />
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
