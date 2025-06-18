import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { find, isNil, sortBy } from 'lodash';
import { Button, Checkbox, Drawer, Input, Space } from 'antd';
import { showResponse } from '@ui/utils/utils';
import { DrawerProps } from "antd/es/drawer";
import { FaberTable } from '@ui/components/base-table';
import { Admin, Fa, FaEnums } from '@ui/types';
import { configApi } from '@ui/services/base';
import { ApiEffectLayoutContext } from "@ui/layout";
import './TableColConfigModal.css';
import { FaFlexRestLayout } from "@ui/components/base-layout";
import { FaSortList } from "@ui/components/base-drag";


export interface TableColConfigModalProps<T> extends DrawerProps {
  columns: FaberTable.ColumnsProp<T>[]; // 配置字段
  biz: string; // Config#biz业务模块
  onConfigChange: (v: FaberTable.ColumnsProp<T>[]) => void; // 排序结束
  children: ReactNode;
}

/**
 * 表格自定义列Modal
 * 1. 操作一栏不进行排序，默认放在最后一排
 */
function TableColConfigModal<T>({columns = [], biz, onConfigChange, children, ...restProps}: TableColConfigModalProps<T>) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext);
  const [config, setConfig] = useState<Admin.Config<FaberTable.ColumnsProp<any>[]>>();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<FaberTable.ColumnsProp<T>[]>(columns);

  /**
   * 解析columns与远端配置，并排序
   */
  function parseItemsSorted(
    columnsArgs: FaberTable.ColumnsProp<T>[],
    configColumns: FaberTable.ColumnsProp<T>[],
  ): FaberTable.ColumnsProp<T>[] {
    const itemList = columnsArgs.map((item) => {
      const remoteItem = find(configColumns, (col) => {
        const dIndex = col.dataIndex instanceof Array ? col.dataIndex.join() : col.dataIndex;
        const cIndex = item.dataIndex instanceof Array ? item.dataIndex.join() : item.dataIndex;
        return dIndex === cIndex;
      });
      return {...item, ...remoteItem};
    });
    return sortBy(itemList, (i) => i.sort);
  }

  /** 获取服务端配置 */
  function fetchRemoteConfig() {
    configApi
      .getOne(biz, FaEnums.ConfigType.TABLE_COLUMNS)
      .then((res: Fa.Ret<Admin.Config<FaberTable.ColumnsProp<T>[]>>) => {
        if (isNil(res.data) || res.data.data.length === 0) return;
        const config = res.data;
        if (onConfigChange) {
          onConfigChange(config.data);
        }
        setConfig(config);
        const newItems = parseItemsSorted(columns, config.data);
        setItems(newItems);
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
    setOpen(true);
    fetchRemoteConfig();
  }

  function handleReset() {
    if (config && config.id) {
      configApi.remove(config.id).then(res => {
        setConfig(undefined)
        setItems(columns);
        if (onConfigChange) onConfigChange(columns);
      })
    }
  }

  /** 保存配置 */
  function handleSave() {
    // 合并修改配置&之前的配置
    const columnsMerge: FaberTable.ColumnsProp<T>[] = items.map((item, index) => {
      const {dataIndex, tcRequired, tcChecked, width} = item;
      return {dataIndex, tcRequired, tcChecked, width, sort: index};
    }) as FaberTable.ColumnsProp<T>[];

    // 新增or更新
    const params = {
      biz,
      type: FaEnums.ConfigType.TABLE_COLUMNS,
      data: columnsMerge,
    };

    let api = null;
    if (config === undefined) {
      api = configApi.save(params).then((res) => showResponse(res, '保存自定义表格配置'));
    } else {
      api = configApi.update(config.id, {id: config.id, ...params}).then((res) => showResponse(res, '更新自定义表格配置'));
    }

    api.then(() => {
      setOpen(false);
      // 通知外部
      if (onConfigChange) onConfigChange(columnsMerge);
    })
  }

  /** 处理Item勾选 */
  function handleItemCheck(item: FaberTable.ColumnsProp<T>, checked: boolean) {
    const newItems = items.map((i) => {
      if (i.dataIndex === item.dataIndex) {
        return {...i, tcChecked: checked};
      }
      return i;
    });
    setItems(newItems);
  }

  const loading = loadingEffect[configApi.getUrl('save')] || loadingEffect[configApi.getUrl('update')];
  return (
    <span>
      <span onClick={showModelHandler}>{children}</span>
      <Drawer
        title="自定义表格字段"
        open={open}
        onClose={() => setOpen(false)}
        width={500}
        destroyOnClose
        extra={
          <Space>
            <Button size="small" onClick={handleReset} loading={loading}>
              重置
            </Button>
            <Button size="small" type="primary" onClick={handleSave} loading={loading}>
              更新
            </Button>
          </Space>
        }
        {...restProps}
      >
        <div className="fa-full-content-p12 fa-flex-column">
          <div className="fa-flex-row-center fa-text" style={{borderBottom: '1px solid #ccc', padding: '8px 0'}}>
            <div className="fa-table-col-thead-item" style={{flex: 1, borderRight: '1px solid #ccc'}}>
              字段
            </div>
            <div className="fa-table-col-thead-item" style={{width: 100}}>
              宽度(px)
            </div>
            <div className="fa-table-col-thead-item" style={{width: 10}}/>
          </div>
          <FaFlexRestLayout>
            <FaSortList
              list={items.filter((i) => i.tcType !== 'menu')}
              rowKey="dataIndex"
              renderItem={(item) => (
                <div className="fa-table-col-item">
                  <Checkbox
                    disabled={item.tcRequired}
                    checked={item.tcRequired || item.tcChecked}
                    onChange={(e) => handleItemCheck(item, e.target.checked)}
                  />
                  <div
                    style={{flex: 1, paddingLeft: 8, fontSize: '14px'}}
                    onClick={() => handleItemCheck(item, !item.tcChecked)}
                  >
                    <span>{item.title}</span>
                  </div>
                  {item.tcRequired ? <span style={{color: '#666', marginRight: 16}}>（必选）</span> : null}
                  <div style={{width: 100, marginRight: 8}}>
                    <Input
                      // addonBefore="宽度"
                      // addonAfter="px"
                      size="small"
                      value={item.width}
                      placeholder="auto"
                      onChange={(e) => {
                        setItems(items.map(i => i.dataIndex === item.dataIndex ? { ...i, width: Number(e.target.value) } : i))
                      }}
                    />
                  </div>
                </div>
              )}
              itemStyle={{borderBottom: '1px solid #ccc'}}
              onSortEnd={(l) => {
                setItems([...l, ...items.filter((i) => i.tcType === 'menu')]);
              }}
              vertical
              handle
            />
          </FaFlexRestLayout>
        </div>
      </Drawer>
    </span>
  );
}

export default TableColConfigModal;
