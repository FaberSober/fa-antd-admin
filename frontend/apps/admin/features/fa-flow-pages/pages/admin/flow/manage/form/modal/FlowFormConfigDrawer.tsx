import { flowFormApi } from '@/services';
import { CalculatorOutlined, DatabaseOutlined, FormOutlined, OrderedListOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaHref, FaUtils } from '@fa/ui';
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
  const [tab, setTab] = useState('database');
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
    setTab('database')
    flowFormApi.getById(itemId).then((res) => {
      setFlowForm(res.data);
    });
  }

  function handleSave() {
    if (!flowForm) return;
    
    // 取消防抖任务，确保立即保存
    debouncedApiUpdate.cancel();
    
    // 调用保存接口
    flowFormApi.update(flowForm.id, { config: flowForm.config }).then((res) => {
      FaUtils.showResponse(res, '保存配置');
      setOpen(false);
      clear();
      refresh && refresh();
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
            <Button 
              onClick={() => {
                const steps = ['database', 'form', 'table'];
                const currentIndex = steps.indexOf(tab);
                if (currentIndex > 0) {
                  setTab(steps[currentIndex - 1]);
                }
              }}
              disabled={tab === 'database'}
            >
              上一步
            </Button>
            <Button 
              onClick={() => {
                const steps = ['database', 'form', 'table'];
                const currentIndex = steps.indexOf(tab);
                if (currentIndex < steps.length - 1) {
                  setTab(steps[currentIndex + 1]);
                }
              }}
              disabled={tab === 'table'}
            >
              下一步
            </Button>
            <Button type="primary" onClick={() => handleSave()} disabled={tab !== 'table'}>保存</Button>
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
                      { value: 'database', label: <span><DatabaseOutlined style={{marginRight: 4}} />数据库表</span> },
                      { value: 'form', label: <span><FormOutlined style={{marginRight: 4}} />表单设计</span> },
                      { value: 'table', label: <span><OrderedListOutlined style={{marginRight: 4}} />列表设计</span> },
                    ]}
                    value={tab}
                    onChange={setTab}
                  />
                </div>

                <FaFlexRestLayout style={{ overflow: 'hidden' }}>
                  {tab === 'database' && (
                    <FormTableEdit />
                  )}
                  {tab === 'form' && (
                    <FaFormEditor
                      flowForm={flowForm}
                      config={flowForm?.config}
                      onChange={handleConfigChange}
                    />
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
