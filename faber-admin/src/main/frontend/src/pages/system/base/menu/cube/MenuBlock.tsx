import React, {useContext, useEffect, useState} from 'react';
import MenuManageContext from "@/pages/system/base/menu/context/MenuManageContext";
import Admin from "@/props/admin";
import menuBlockApi from '@/services/admin/menuBlock'
import FaberBase from "@/props/base/FaberBase";
import {RES_CODE} from "@/configs/server.config";
import {Modal, Spin} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import MenuBlockModal from "@/pages/system/base/menu/modal/MenuBlockModal";
import styles from '../styles/MenuBlock.module.less'
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";
import {showResponse} from "@/utils/utils";


export interface MenuBlockProps {
  showOprBtn?: boolean;
}

/**
 * @author xu.pengfei
 * @date 2021/11/20 16:00
 */
export default function MenuBlock({ showOprBtn }: MenuBlockProps) {
  const { viewBlock, changeViewBlock } = useContext(MenuManageContext)

  const [array, setArray] = useState<Admin.MenuBlock[]>([])
  const [loading, setLoading] = useState(false)

  const [editItem, setEditItem] = useState<Admin.MenuBlock>()
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);

  function fetchData() {
    setLoading(true)
    menuBlockApi.list({ delState: FaberBase.DelState.AVAILABLE, sorter: 'sort ASC' }).then((res) => {
      setLoading(false)
      if (res && res.status === RES_CODE.OK) {
        setArray(res.data)
        if (res.data && res.data[0] && viewBlock === undefined) {
          changeViewBlock(res.data[0])
        }
      }
    }).catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchData();
  }, [])

  function handleEditItem(e: any, { target, ...item }: any) {
    if (e) e.stopPropagation();
    setEditItem(item)
    setEditItemModalVisible(true)
  }

  function confirmDelItem(e: any, item: Admin.MenuBlock) {
    if (e) e.stopPropagation();
    Modal.confirm({
      title: '删除确认',
      content: `确认删除【${item.name}】？`,
      okText: '删除',
      okButtonProps: { type: 'primary', danger: true },
      onOk: () => {
        menuBlockApi.logicDeleteById(item.id).then((res) => {
          showResponse(res, '删除')
          fetchData()
        })
      },
      cancelText: '取消',
    });
  }

  return (
    <div className="faber-flex-row" style={{ overflowY: 'hidden', overflowX: 'auto', alignItems: 'center' }}>
      <Spin spinning={loading}>
        <div className={styles.list}>
          {array.map((i) => (
            <div key={i.id} className={styles[viewBlock?.id === i.id ? 'item-sel' : 'item']} onClick={() => changeViewBlock(i)}>
              <ContextMenuTrigger id={`menu-block-list-${i.id}`} holdToDisplay={-1}>
                <div className={styles['holder']}>
                  <div>{i.name}</div>
                  <div>{i.no}</div>
                </div>
              </ContextMenuTrigger>
              {showOprBtn && (
                <ContextMenu id={`menu-block-list-${i.id}`}>
                  <MenuItem data={i} onClick={handleEditItem}>
                    <EditOutlined /> 编辑
                  </MenuItem>
                  <MenuItem data={i} onClick={confirmDelItem}>
                <span style={{ color: '#ff4d4f' }}>
                  <DeleteOutlined /> 删除
                </span>
                  </MenuItem>
                </ContextMenu>
              )}
            </div>
          ))}
        </div>
      </Spin>
      {showOprBtn && (
        <MenuBlockModal title="新增模块" fetchFinish={fetchData}>
          <div className={styles.item} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div><PlusOutlined />新增模块</div>
          </div>
        </MenuBlockModal>
      )}

      <MenuBlockModal
        title="编辑模块"
        record={editItem}
        visible={editItemModalVisible}
        fetchFinish={() => {
          fetchData();
          setEditItemModalVisible(false)
        }}
        onCancel={() => setEditItemModalVisible(false)}
      />
    </div>
  )
}
