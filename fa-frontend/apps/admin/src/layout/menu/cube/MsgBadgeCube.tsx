import React, {CSSProperties, useContext, useEffect, useState} from 'react';
import msgService from '@/services/admin/msg';
import * as Admin from '../../../../types/admin';
import {RES_CODE} from '@/configs/server.config';
import {Avatar, Badge, List, Popover} from 'antd';
import {get} from 'lodash';
import {BellOutlined} from '@ant-design/icons';
import {Link} from "react-router-dom";
import {UserLayoutContext} from "@/layout/UserLayout";
import * as FaEnums from "@/../../../../types/base/FaEnums";

function MsgList() {
  const { unreadCount, refreshUnreadCount } = useContext(UserLayoutContext);

  const [data, setData] = useState<Admin.Msg[]>([]);

  useEffect(() => {
    fetchMsgList();
  }, [unreadCount]);

  function fetchMsgList() {
    msgService.pageMine({ pageSize: 10, isRead: false }).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setData(res.data.rows);
      }
      refreshUnreadCount();
    });
  }

  function handleReadOne(id: string) {
    msgService.batchRead([id]).then(() => {
      refreshUnreadCount();
      // fetchMsgList();
    });
  }

  const bottomLink: CSSProperties = {
    width: '100%',
    padding: '12px 12px',
    textAlign: 'center',
    display: 'inline-block',
    borderTop: '1px solid #eee',
  };

  return (
    <div style={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={get(item, 'fromUser.img')} />}
              title={<a onClick={() => handleReadOne(item.id)}>{get(item, 'content')}</a>}
              // description={get(item, 'content')}
            />
          </List.Item>
        )}
      />
      <Link to="/system/account/msg" style={bottomLink}>
        查看更多
      </Link>
    </div>
  );
}

/**
 * 个人消息提示Badge
 * @author xu.pengfei
 * @date 2021/1/7
 */
export default function MsgBadgeCube() {
  const { unreadCount } = useContext(UserLayoutContext);

  return (
    <Popover placement="bottomRight" content={<MsgList />} trigger="click">
      <div style={{ padding: '0 12px', cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <a>
          <Badge size="small" count={unreadCount}>
            <BellOutlined style={{ color: '#eee', margin: '0 4px' }} />
          </Badge>
        </a>
      </div>
    </Popover>
  );
}
