import React, { useState } from 'react';
import { Disk } from '@/types';
import { Checkbox, Modal } from 'antd';
import useKeyboardJs from 'react-use/lib/useKeyboardJs';
import { Item, ItemParams, Menu, useContextMenu } from 'react-contexify';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { isNil } from 'lodash';
import { storeFileApi } from '@/services';
import { FaUtils } from "@fa/ui";
import { FileIcon } from '@/components';
import StoreDirModal from '../modal/StoreDirModal';


export interface FileGridProps {
  dirId: number;
  files: Disk.StoreFile[];
  selectedRowKeys: number[]; // 选中的ids
  onSelectedChange: (rowKeys: number[]) => void;
  showHeader: boolean;
  onRefresh: () => void;
  onIntoDir: (dirId: number) => void;
}

const MENU_ID = 'file-grid-menu';
/**
 * @author xu.pengfei
 * @date 2022/12/29 14:22
 */
export default function FileGrid({ dirId, files, selectedRowKeys, onSelectedChange, showHeader, onRefresh, onIntoDir }: FileGridProps) {
  const [isPressed1] = useKeyboardJs('win');
  const [isPressed2] = useKeyboardJs('shift');

  const [edit, setEdit] = useState<Disk.StoreFile>();
  const [open, setOpen] = useState<boolean>(false);

  function handleChangeAll() {
    if (selectedRowKeys.length === files.length) {
      onSelectedChange([]);
    } else {
      onSelectedChange(files.map((i) => i.id));
    }
  }

  function handleClickItem(item: Disk.StoreFile) {
    if (isPressed1 || isPressed2) {
      if (selectedRowKeys.indexOf(item.id) > -1) {
        onSelectedChange(selectedRowKeys.filter((i) => i !== item.id));
      } else {
        onSelectedChange([...selectedRowKeys, item.id]);
      }
    } else {
      onSelectedChange([item.id]);
    }
  }

  function handleBatchDelete() {
    if (isNil(selectedRowKeys) || selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: '删除',
      content: `确认删除勾选中的 ${selectedRowKeys.length} 条数据？`,
      okText: '删除',
      okType: 'danger',
      onOk: async (close) => {
        storeFileApi.removeBatchByIds(selectedRowKeys).then((res) => {
          FaUtils.showResponse(res, '删除');
          onRefresh();
          close();
        });
      },
    });
  }

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function handleContextMenu(event: any, props: Disk.StoreFile) {
    show({ event, props });
  }

  const handleItemClick = ({ id, props }: ItemParams) => {
    const item = props as Disk.StoreFile;
    switch (id) {
      case 'rename':
        setEdit(item);
        setOpen(true);
        break;
      case 'del':
        handleBatchDelete();
        break;
    }
  };

  return (
    <div>
      {showHeader && (
        <div className="fa-flex-row-center fa-border-b fa-bg-grey" style={{ height: 39 }}>
          <Checkbox
            checked={files.length > 0 && selectedRowKeys.length === files.length}
            onChange={() => handleChangeAll()}
            style={{ marginLeft: 8 }}
          >
            <div style={{ marginLeft: 6 }}>
              共<a>{files.length}</a>个条目
            </div>
          </Checkbox>
        </div>
      )}
      <div className="fa-flex-row fa-flex-wrap">
        {files.map((i) => {
          const sel = selectedRowKeys.indexOf(i.id) > -1;
          return (
            <div
              key={i.id}
              className="fa-disk-grid-item"
              onClick={() => handleClickItem(i)}
              onDoubleClick={() => {
                if (i.dir) onIntoDir(i.id);
              }}
              onContextMenu={(e) => handleContextMenu(e, i)}
            >
              <div className={sel ? 'fa-disk-grid-item-icon-selected' : 'fa-disk-grid-item-icon'}>
                <FileIcon file={i} width={60} />
              </div>
              <div className={sel ? 'fa-disk-grid-item-name-selected' : 'fa-disk-grid-item-name'}>{i.name}</div>
            </div>
          );
        })}
      </div>

      {/* context menu */}
      <Menu id={MENU_ID} className="contextMenu">
        {selectedRowKeys.length === 1 && (
          <Item id="rename" onClick={handleItemClick}>
            <EditOutlined style={{ width: 16 }} /> 重命名
          </Item>
        )}
        <Item id="del" onClick={handleItemClick}>
          <span style={{ color: '#F00' }}>
            <DeleteOutlined style={{ width: 16 }} /> 删除
          </span>
        </Item>
      </Menu>

      {/* rename */}
      {open && (
        <StoreDirModal
          record={edit}
          dirId={dirId}
          title="重命名"
          fetchFinish={() => {
            onRefresh();
            setOpen(false);
          }}
          open={open}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}
