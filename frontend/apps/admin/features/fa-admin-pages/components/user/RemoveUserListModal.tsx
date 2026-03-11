import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { DragModal, DragModalProps, FaFlexRestLayout } from '@fa/ui';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { Avatar, Button, Checkbox, Input } from 'antd';
import { trim } from 'lodash';
import React, { useMemo, useState } from 'react';

export interface UserVo {
  id: string;
  img: string;
  name: string;
}

export interface RemoveUserListModalProps extends DragModalProps {
  userList: UserVo[];
  onShow?: () => void;
  onRemove: (removeUserList: UserVo[]) => void|Promise<any>;
}

/**
 * @author xu.pengfei
 * @date 2025-09-11 14:28:45
 */
export default function RemoveUserListModal({ userList, onShow, onRemove, children, ...props }: RemoveUserListModalProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>();
  const [selUserList, setSelUserList] = useState<UserVo[]>([]);
  const [loading, setLoading] = useState(false);

  function handleOnOk() {
    setLoading(true)
    const onRemoveRet = onRemove(selUserList)
    if (onRemoveRet instanceof Promise) {
      onRemoveRet.then(() => {
        setLoading(false)
        setOpen(false)
      }).catch(() => setLoading(false))
    } else {
      setLoading(false)
      setOpen(false)
    }
  }

  function showModal() {
    setOpen(true);
    onShow?.()
  }

  const showUserList = useMemo(() => {
    return userList.filter(i => {
      if (trim(search) === '') return true;
      return i.name.indexOf(trim(search)) > -1
    })
  }, [search, userList])

  const selUserIds = selUserList.map(i => i.id)

  function handleClickUser(user: UserVo) {
    let newArr = [...selUserList]
    if (selUserIds.includes(user.id)) {
      newArr = newArr.filter(i => i.id !== user.id)
    } else {
      newArr = [ ...newArr, user ]
    }
    setSelUserList(newArr)
  }

  return (
    <span>
      <span onClick={showModal}>
        {children}
      </span>
      <DragModal
        title="移除用户"
        open={open}
        onOk={() => handleOnOk()}
        okButtonProps={{ disabled: selUserList.length === 0, danger: true }}
        okText="移除"
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <div className='fa-flex-row fa-gap12' style={{height: 500}}>
          {/* user list */}
          <div className='fa-flex-1 fa-flex-column'>
            <div className='fa-flex-row-center' style={{height: 40}}>
              <Input
                placeholder="搜索"
                prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <FaFlexRestLayout>
              {showUserList.map(user => {
                return (
                  <div key={user.id} className='fa-p6 fa-border-b fa-base-btn fa-flex-row-center fa-gap12' onClick={() => handleClickUser(user)}>
                    <Checkbox checked={selUserIds.includes(user.id)} />
                    <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(user.img)} />} size={36} />
                    <div>{user.name}</div>
                  </div>
                )
              })}
            </FaFlexRestLayout>
          </div>
          {/* selected remove user list */}
          <div className='fa-flex-1 fa-flex-column'>
            <div className='fa-flex-row-center' style={{height: 40}}>
              <div className='fa-flex-1'>移除群成员</div>
              {selUserList.length > 0 && (<div>已选择{selUserList.length}个联系人</div>)}
            </div>

            <FaFlexRestLayout>
              {selUserList.map(user => {
                return (
                  <div key={user.id} className='fa-p6 fa-border-b fa-flex-row-center fa-gap12' onClick={() => handleClickUser(user)}>
                    <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(user.img)} />} size={36} />
                    <div className='fa-flex-1'>{user.name}</div>
                    <Button icon={<CloseOutlined />} type='text'></Button>
                  </div>
                )
              })}
            </FaFlexRestLayout>
          </div>
        </div>
      </DragModal>
    </span>
  );
}
