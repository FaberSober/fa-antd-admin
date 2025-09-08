import { fileSaveApi, userApi } from '@/services';
import { Admin } from '@/types';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Empty, Splitter } from 'antd';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

/**
 * @author xu.pengfei
 * @date 2025-09-08 14:17:52
 */
export default function ImChatUserPanel() {
  const [userList, setUserList] = useState<Admin.User[]>([]);
  const [userSel, setUserSel] = useState<Admin.User>();

  function getUserList() {
    userApi.list({ sorter: 'name ASC' }).then(res => {
      setUserList(res.data)
    })
  }

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <Splitter style={{ height: '100%' }}>
      {/* left item */}
      <Splitter.Panel defaultSize={260} min={240} max="70%">
        <div className='fa-im-wx-panel-left-sub fa-flex-column'>
          {userList.map(user => {
            return (
              <div key={user.id} className={clsx('fa-flex-row-center fa-base-btn fa-p12', userSel?.id === user.id && 'fa-im-wx-item-selected')} onClick={() => setUserSel(user)}>
                <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(user.img)} alt={user.name} />} />
                <div className='fa-ml12'>{user.name}</div>
              </div>
            )
          })}
        </div>
      </Splitter.Panel>

      {/* right main content */}
      <Splitter.Panel>
        <div className='fa-im-wx-panel-right fa-flex-center'>
          {userSel ? (
            <div>
              <div className='fa-flex-row'>
                <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(userSel.img)} alt={userSel.name} />} size={50} />

                <div className='fa-ml12'>
                  <div className='fa-h3'>{userSel.name}</div>
                  <div>部门：{userSel.departmentName}</div>
                  <div>手机：{userSel.tel}</div>
                </div>
              </div>

              <div className='fa-flex-row'>
                <div className='fa-btn'>
                  发消息
                </div>
              </div>
            </div>
          ) : <Empty />}
        </div>
      </Splitter.Panel>
    </Splitter>
  );
}
