import React, { useContext, useEffect, useState } from 'react';
import { Flow } from '@/types';
import { BaseDrawerContext, FaFlexRestLayout, FaUtils } from '@fa/ui';
import { Button, Modal, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { flowProcessApi } from '@features/fa-flow-pages/services';
import { FaWorkFlow } from '@features/fa-flow-pages/components';


interface FlowProcessEditProps {
  item: Flow.FlowProcess;
  onSuccess?: () => void;
  viewOnly?: boolean;
}

export default function FlowProcessEdit({item, onSuccess, viewOnly}: FlowProcessEditProps) {
  const {closeDrawer} = useContext(BaseDrawerContext)
  const [data, setData] = useState({ ...item });

  useEffect(() => {
    setData({ ...item });
  }, [item]);

  function handlePublish() {
    Modal.confirm({
      title: '发布流程',
      content: '确定要发布该流程吗？',
      onOk: () => {
        flowProcessApi.publish(data).then(res => {
          FaUtils.showResponse(res, '发布流程');
          onSuccess?.();
          closeDrawer();
        });
      },
    });
  }

  return (
    <div className='fa-full-content-p12 fa-flex-column'>
      <div className='fa-pb12'>
        {!viewOnly && (
          <Space>
            <Button onClick={handlePublish} type='primary' icon={<SendOutlined />}>发布</Button>
          </Space>
        )}
      </div>

      <FaFlexRestLayout>
        <FaWorkFlow
          processModel={JSON.parse(data.modelContent)}
          onChange={v => setData(prev => ({ ...prev, modelContent: JSON.stringify(v) }))}
        />
      </FaFlexRestLayout>
    </div>
  );
}
