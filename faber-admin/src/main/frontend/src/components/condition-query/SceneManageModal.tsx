import React, {ReactNode, useImperativeHandle, useState} from 'react';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import configService from '@/services/admin/config';
import {arrayMove, showResponse} from '@/utils/utils';
import {RES_CODE} from '@/configs/server.config';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {DeleteOutlined, EditOutlined, MenuOutlined} from '@ant-design/icons';
import {Checkbox, Popconfirm, Space, Tooltip} from 'antd';
import Admin from '@/props/admin';
import ConditionQueryModal from '@/components/condition-query/ConditionQueryModal';
import {FaberTable} from '@/components/base-table';
import './SceneManageModal.less';

interface IProps<T> extends DragModalProps {
  buzzModal: string;
  columns: FaberTable.ColumnsProp<T>[];
  onOk?: () => void;
}

/**
 * 表格自定义列Modal
 */
/* eslint-disable react/jsx-props-no-spreading */
function SceneManageModal<T>({ buzzModal, columns, onOk, ...restProps }: IProps<T>, ref: any) {
  const [loading, setLoading] = useState(false);
  const [configList, setConfigList] = useState<Admin.Config[]>([]);

  useImperativeHandle(ref, () => ({
    fetchRemoteConfig: () => {
      fetchRemoteConfig();
    },
  }));

  /** 获取远程配置 */
  function fetchRemoteConfig() {
    if (buzzModal) {
      configService.findAllScene({ buzzModal, type: Admin.ConfigType.QUERY_CONDITION }).then((res) => {
        if (res && res.status === RES_CODE.OK) {
          setConfigList(res.data);
        }
      });
    }
  }

  /** 处理-增加item */
  async function handleSave() {
    setLoading(true);
    const params = configList.map((item) => ({ id: item.id, hide: item.hide, defaultScene: item.defaultScene }));
    const res = await configService.batchUpdate(params);
    showResponse(res, '更新场景配置');
    if (res && res.status === RES_CODE.OK) {
      if (onOk) onOk();
    }
    setLoading(false);
  }

  /** 删除Item */
  function handleDelete(id: number) {
    configService.remove(id).then((res) => {
      showResponse(res, '删除场景配置');
      fetchRemoteConfig();
    });
  }

  /** 处理Item勾选 */
  function handleItemCheck(item: Admin.Config, checked: boolean) {
    const newList = configList.map((i) => {
      if (i.id === item.id) {
        return { ...i, hide: checked ? '0' : '1' };
      }
      return i;
    });
    setConfigList(newList);
  }

  function onSortEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) {
    if (oldIndex === newIndex) return;

    const newItems = arrayMove(configList, oldIndex, newIndex);
    setConfigList(newItems);
  }

  const DragHandle = SortableHandle(() => (
    <div style={{ cursor: 'move' }}>
      <MenuOutlined />
    </div>
  ));

  interface SProp {
    item: Admin.Config;
  }
  const SortableItem = SortableElement(({ item }: SProp) => (
    <div className="itemContainer">
      <Checkbox
        style={{ width: 40 }}
        disabled={item.system === '1'}
        checked={item.system === '1' || item.hide === '0'}
        onChange={(e) => handleItemCheck(item, e.target.checked)}
      />
      <div style={{ flex: 1, paddingLeft: 8 }}>
        <strong>{item.name}</strong>
      </div>
      {item.system === '1' ? <span style={{ color: '#666', marginRight: 16 }}>（系统场景）</span> : null}
      <div>
        {item.system === '1' ? null : (
          <Space>
            <ConditionQueryModal record={item} buzzModal={buzzModal} columns={columns} onConditionChange={fetchRemoteConfig} showSuffix={false}>
              <a>
                <EditOutlined /> 编辑
              </a>
            </ConditionQueryModal>
            <Popconfirm title="确认删除?" onConfirm={() => handleDelete(item.id)} getPopupContainer={() => document.body}>
              <Tooltip placement="bottom" title="删除">
                <a style={{ color: 'red' }}>
                  <DeleteOutlined /> 删除
                </a>
              </Tooltip>
            </Popconfirm>
            <DragHandle />
          </Space>
        )}
      </div>
    </div>
  ));

  const MySortableContainer = SortableContainer((props: { children: ReactNode }) => <div>{props.children}</div>);

  return (
    <DragModal title="管理场景" onOk={handleSave} confirmLoading={loading} width={700} destroyOnClose {...restProps}>
      <div>
        <div style={{ display: 'flex', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#eee', padding: 8 }}>
          <div style={{ width: 40 }}>展示</div>
          <div style={{ flex: 1, paddingLeft: 8 }}>场景名称</div>
          <div>操作</div>
        </div>
        <MySortableContainer onSortEnd={onSortEnd} useDragHandle>
          {configList.map((value, index) => (
            <SortableItem key={`item-${value.id}`} index={index} item={value} />
          ))}
        </MySortableContainer>
      </div>
    </DragModal>
  );
}

export default React.forwardRef(SceneManageModal);
