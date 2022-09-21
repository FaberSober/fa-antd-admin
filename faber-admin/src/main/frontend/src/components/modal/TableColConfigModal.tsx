import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { find, sortBy } from 'lodash';
import { MenuOutlined } from '@ant-design/icons';
import {Button, Checkbox, Drawer, Input, Space} from 'antd';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMove, showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import { ModalProps } from 'antd/es/modal';
import FaberTable from '@/components/base-table/interface';
import * as BaseTableUtils from '@/components/base-table/utils';
import Admin from '@/props/admin';
import configService from '@/services/admin/config';
import { BaseBizTableContext } from "@/components/base-table/BaseBizTable";
import './TableColConfigModal.less';
import {FaFlexRestLayout} from "@/components/base-layout";

const colWidthCache: { [key: string]: number } = {};

interface IProps<T> extends ModalProps {
  columns: FaberTable.ColumnsProp<T>[]; // 配置字段
  buzzModal: string; // Config#buzzModal业务模块
  buzzName: string; // Config#name业务名称
  onConfigChange: (v: FaberTable.ColumnsProp<T>[]) => void; // 排序结束
  children: ReactNode;
}

/**
 * 表格自定义列Modal
 * TODO 操作一栏需要固定在最后，无法移动
 */
function TableColConfigModal<T>({ columns = [], buzzModal, buzzName, onConfigChange, children, ...restProps }: IProps<T>) {
  const { localData } = useContext(BaseBizTableContext)

  const [config, setConfig] = useState<Admin.Config>();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<FaberTable.ColumnsProp<T>[]>(columns);

  /**
   * 解析columns与远端配置，并排序
   */
  function parseItemsSorted(columnsArgs: FaberTable.ColumnsProp<T>[], configArgs: Admin.Config): FaberTable.ColumnsProp<T>[] {
    const configJSON: FaberTable.Config<T> = JSON.parse(configArgs.data);
    const itemList = columnsArgs.map((item) => {
      const remoteItem = find(configJSON.columns, (col) => {
        const dIndex = col.dataIndex instanceof Array ? col.dataIndex.join() : col.dataIndex;
        const cIndex = item.dataIndex instanceof Array ? item.dataIndex.join() : item.dataIndex;
        return dIndex === cIndex;
      });
      return { ...item, ...remoteItem };
    });
    return sortBy(itemList, (i) => i.sort);
  }

  /** 获取服务端配置 */
  function fetchRemoteConfig() {
    if (localData) return;
    configService.findByScene({ buzzModal, type: Admin.ConfigType.TABLE_COLUMNS }).then((res) => {
      if (res && res.status === RES_CODE.OK && res.data !== undefined && res.data !== null) {
        const configJSON: FaberTable.Config<T> = JSON.parse(res.data.data);
        if (configJSON.columns && onConfigChange) {
          onConfigChange(configJSON.columns);
        }
        setConfig(res.data);
        const newItems = parseItemsSorted(columns, res.data);
        // console.log('newItems', newItems)
        setItems(newItems);
      }
    });
  }

  // 初始化加载表格配置
  useEffect(() => {
    fetchRemoteConfig();
  }, []);

  /** 展示Modal */
  function showModelHandler(e: React.MouseEvent<HTMLElement>) {
    if (e) {
      e.stopPropagation();
    }
    setModalVisible(true);
    fetchRemoteConfig();
  }

  /** 保存配置 */
  function handleSave() {
    setLoading(true);

    // 合并修改配置&之前的配置
    const columnsMerge: FaberTable.ColumnsProp<T>[] = items.map((item, index) => {
      const { dataIndex, tcRequired, tcChecked, width } = item;
      if (BaseTableUtils.dataIndexToString(dataIndex) in colWidthCache) {
        return { dataIndex, tcRequired, tcChecked, width: colWidthCache[BaseTableUtils.dataIndexToString(dataIndex)], sort: index };
      }
      return { dataIndex, tcRequired, tcChecked, width, sort: index };
    });

    // 新增or更新
    if (!localData) {
      const params = {
        buzzModal,
        type: Admin.ConfigType.TABLE_COLUMNS,
        name: buzzName,
        data: JSON.stringify({ columns: columnsMerge }),
        system: '0',
      };

      if (config === undefined) {
        configService.add(params).then((res) => showResponse(res, '保存自定义表格配置'));
      } else {
        configService.update(config.id, { id: config.id, belongUserId: config.belongUserId, ...params }).then((res) => showResponse(res, '更新自定义表格配置'));
      }
    }

    setModalVisible(false);
    // 通知外部
    if (onConfigChange) onConfigChange(columnsMerge);

    setLoading(false);
  }

  /** 排序变更 */
  function onSortEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) {
    if (oldIndex === newIndex) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
  }

  /** 处理Item勾选 */
  function handleItemCheck(item: FaberTable.ColumnsProp<T>, checked: boolean) {
    const newItems = items.map((i) => {
      if (i.dataIndex === item.dataIndex) {
        return { ...i, tcChecked: checked };
      }
      return i;
    });
    setItems(newItems);
  }

  /** item#width变化 */
  function handleWidthChange(value: number, item: FaberTable.ColumnsProp<T>) {
    colWidthCache[BaseTableUtils.dataIndexToString(item.dataIndex)] = value;
  }

  const DragHandle = SortableHandle(() => (
    <div style={{ cursor: 'move' }}>
      <MenuOutlined />
    </div>
  ));

  interface SProp {
    item: FaberTable.ColumnsProp<T>;
  }
  const SortableItem = SortableElement(({ item }: SProp) => (
    <div className="itemContainer">
      <Checkbox disabled={item.tcRequired} checked={item.tcRequired || item.tcChecked} onChange={(e) => handleItemCheck(item, e.target.checked)} />
      <div style={{ flex: 1, paddingLeft: 8, fontSize: '14px' }} onClick={() => handleItemCheck(item, !item.tcChecked)}>
        <span>{item.title}</span>
      </div>
      {item.tcRequired ? <span style={{ color: '#666', marginRight: 16 }}>（必选）</span> : null}
      <div style={{ width: 100, marginRight: 8 }}>
        <Input
          // addonBefore="宽度"
          // addonAfter="px"
          size="small"
          defaultValue={item.width}
          placeholder="auto"
          onChange={(e) => handleWidthChange(Number(e.target.value), item)}
        />
      </div>
      <DragHandle />
    </div>
  ));

  const MySortableContainer = SortableContainer((props: { children: ReactNode }) => <div>{props.children}</div>);

  return (
    <span>
      <span onClick={showModelHandler}>{children}</span>
      <Drawer
        title="自定义表格字段"
        open={modalVisible}
        onOk={handleSave}
        confirmLoading={loading}
        onClose={() => setModalVisible(false)}
        width={500}
        destroyOnClose
        {...restProps}
      >
        <div style={{ height: '100%', position: 'relative' }}>
          <div className="faber-full-content-no-padding faber-flex-column">
            <div className="faber-flex-row-center" style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
              <div className="tableColTheadItem" style={{ flex: 1, borderRight: '1px solid #ccc' }}>字段</div>
              <div className="tableColTheadItem" style={{ width: 100 }}>宽度(px)</div>
              <div className="tableColTheadItem" style={{ width: 31 }}></div>
            </div>
            <FaFlexRestLayout>
              <MySortableContainer onSortEnd={onSortEnd} useDragHandle>
                {items.map((value, index) => (
                  <SortableItem key={`item-${value.dataIndex}`} index={index} item={value} />
                ))}
              </MySortableContainer>
            </FaFlexRestLayout>

            <Space style={{ marginTop: 12 }}>
              <Button type="primary" onClick={handleSave} loading={loading}>更新</Button>
            </Space>
          </div>
        </div>
      </Drawer>
    </span>
  );
}

export default TableColConfigModal;
