import { FaApiScrollList, FaApiScrollListRef } from '@/components';
import type { Admin } from '@/types';
import { AppstoreOutlined, AuditOutlined, SettingOutlined } from '@ant-design/icons';
import { BaseDrawerContext, FaFlexRestLayout, FaUtils, FaEnums } from '@fa/ui';
import { fileSaveApi, msgApi } from '@features/fa-admin-pages/services';
import { Avatar, Badge, Divider, Modal, Segmented, Space } from 'antd';
import { get } from 'lodash';
import { useContext, useEffect, useRef, useState } from 'react';
import UserLayoutContext from '../../user/context/UserLayoutContext';
import MenuLayoutContext from '../context/MenuLayoutContext';

interface MsgListProps {
  onClose?: () => void;
}

/**
 * 消息列表
 * @param onClose
 * @constructor
 */
export default function MsgList({ onClose }: MsgListProps) {
  const scrollListRef = useRef<FaApiScrollListRef>(null);
  const [tab, setTab] = useState('all');

  const { unreadCount, refreshUnreadCount } = useContext(UserLayoutContext);
  const { closeDrawer } = useContext(BaseDrawerContext)
  const { addTab } = useContext(MenuLayoutContext);

  useEffect(() => {
    scrollListRef.current?.refresh();
  }, [unreadCount, tab]);

  function handleReadOne(item: Admin.Msg) {
    // 根据消息类型确定打开页面
    if (item.type === FaEnums.MsgTypeEnum.FLOW) {
      // open flow audit page
      addTab({
        key: 'flow',
        path: '/admin/flow/manage/audit',
        name: '流程审批',
      });
    }
    msgApi.batchRead([item.id]).then(() => {
      refreshUnreadCount();
      scrollListRef.current?.refresh();
    });
  }

  /** 全部已读 */
  function handleReadAll() {
    Modal.confirm({
      title: '全部已读',
      content: '确认标记全部消息为已读？',
      onOk: () =>
        msgApi.readAll().then((res) => {
          FaUtils.showResponse(res, '标记全部已读');
          scrollListRef.current?.refresh();
        }),
    });
  }

  function handleOpenMsgTag() {
    addTab({
      key: 'msg',
      path: '/admin/system/account/msg',
      name: '消息中心',
    });
    if (onClose) onClose();
    if (closeDrawer) closeDrawer();
  }

  function getMsgType() {
    if (tab === '1') return 1;
    if (tab === '2') return 2;
    return "";
  }

  return (
    <div className='fa-full-content fa-flex-column'>
      <div className='fa-p12 fa-flex-row-center'>
        <div className='fa-flex-1'>
          <Segmented
            options={[
              { label: '全部', value: 'all', icon: <AppstoreOutlined /> },
              { label: '流程', value: '2', icon: <SettingOutlined /> },
              { label: '系统', value: '1', icon: <AuditOutlined /> },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>
        <Space size={0}>
          <a onClick={handleReadAll}>全部已读</a>
          <Divider orientation='vertical' />
          <a onClick={handleOpenMsgTag}>查看更多</a>
        </Space>
      </div>

      <FaFlexRestLayout>
        <FaApiScrollList
          ref={scrollListRef}
          apiPage={(params) => msgApi.pageMine({ ...params, query: { isRead: false, type: getMsgType() }, sorter: 'id DESC' })}
          renderItem={(item: Admin.Msg) => (
            <div key={item.id} className='fa-border-b fa-p12 fa-flex-row-center fa-hover'>
              <Avatar size="small" src={fileSaveApi.genLocalGetFilePreview(get(item, 'fromUser.img')!)} />

              <div onClick={() => handleReadOne(item)} className='fa-ml12 fa-flex-1 fa-break-word'>
                {get(item, 'content')}
              </div>
              {!item.isRead && <Badge status="success" style={{margin: '0 6px'}} />}
              <div>{item.crtTime}</div>
            </div>
          )}
          formStyle={{ padding: '0 12px' }}
        />
      </FaFlexRestLayout>
    </div>
  );
}
