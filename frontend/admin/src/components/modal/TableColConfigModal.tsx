import React, {ReactNode, useContext, useEffect, useState} from 'react';
import {find, sortBy} from 'lodash';
import {Button, Checkbox, Drawer, Input} from 'antd';
import {showResponse} from '@/utils/utils';
import {ModalProps} from 'antd/es/modal';
import {FaberTable} from '@/components/base-table';
import * as BaseTableUtils from '@/components/base-table/utils';
import Admin from '@/props/admin';
import configApi from '@/services/admin/config';
import {FaFlexRestLayout} from "@/components/base-layout";
import {FaSortList} from "@/components/base-drag";
import styles from './TableColConfigModal.module.less';
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import FaEnums from "@/props/base/FaEnums";


const colWidthCache: { [key: string]: number } = {};

interface IProps<T> extends ModalProps {
  columns: FaberTable.ColumnsProp<T>[]; // 配置字段
  biz: string; // Config#biz业务模块
  onConfigChange: (v: FaberTable.ColumnsProp<T>[]) => void; // 排序结束
  children: ReactNode;
}

/**
 * 表格自定义列Modal
 * 1. 操作一栏不进行排序，默认放在最后一排
 */
function TableColConfigModal<T>({ columns = [], biz, onConfigChange, children, ...restProps }: IProps<T>) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [config, setConfig] = useState<Admin.Config<FaberTable.ColumnsProp<any>[]>>();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<FaberTable.ColumnsProp<T>[]>(columns);

  /**
   * 解析columns与远端配置，并排序
   */
  function parseItemsSorted(columnsArgs: FaberTable.ColumnsProp<T>[], configColumns: FaberTable.ColumnsProp<T>[]): FaberTable.ColumnsProp<T>[] {
    const itemList = columnsArgs.map((item) => {
      const remoteItem = find(configColumns, (col) => {
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
    configApi.getOne(biz, FaEnums.ConfigType.TABLE_COLUMNS).then(res => {
      if (res.data.length === 0) return;
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

  /** 保存配置 */
  function handleSave() {
    // 合并修改配置&之前的配置
    const columnsMerge: FaberTable.ColumnsProp<T>[] = items.map((item, index) => {
      const { dataIndex, tcRequired, tcChecked, width } = item;
      if (BaseTableUtils.dataIndexToString(dataIndex) in colWidthCache) {
        return { dataIndex, tcRequired, tcChecked, width: colWidthCache[BaseTableUtils.dataIndexToString(dataIndex)], sort: index };
      }
      return { dataIndex, tcRequired, tcChecked, width, sort: index };
    }) as FaberTable.ColumnsProp<T>[];

    // 新增or更新
    const params = {
      biz,
      type: FaEnums.ConfigType.TABLE_COLUMNS,
      data: columnsMerge,
    };

    if (config === undefined) {
      configApi.save(params).then((res) => showResponse(res, '保存自定义表格配置'));
    } else {
      configApi.update(config.id, { id: config.id, ...params }).then((res) => showResponse(res, '更新自定义表格配置'));
    }

    setOpen(false);
    // 通知外部
    if (onConfigChange) onConfigChange(columnsMerge);
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

  const loading = loadingEffect[configApi.getUrl('save')] || loadingEffect[configApi.getUrl('update')]
  return (
    <span>
      <span onClick={showModelHandler}>{children}</span>
      <Drawer
        title="自定义表格字段"
        open={open}
        onOk={handleSave}
        confirmLoading={loading}
        onClose={() => setOpen(false)}
        width={500}
        destroyOnClose
        extra={<Button size="small" type="primary" onClick={handleSave} loading={loading}>更新</Button>}
        {...restProps}
      >
        <div className="fa-full-content-p12 fa-flex-column">
          <div className="fa-flex-row-center" style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
            <div className={styles.tableColTheadItem} style={{ flex: 1, borderRight: '1px solid #ccc' }}>字段</div>
            <div className={styles.tableColTheadItem} style={{ width: 100 }}>宽度(px)</div>
            <div className={styles.tableColTheadItem} style={{ width: 31 }} />
          </div>
          <FaFlexRestLayout>
            <FaSortList
              list={items.filter(i => i.tcType !== 'menu')}
              rowKey="dataIndex"
              renderItem={(item) => (
                <div className={styles.itemContainer}>
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
                </div>
              )}
              itemStyle={{borderBottom: '1px solid #ccc'}}
              onSortEnd={(l) => {
                setItems([ ...l, ...items.filter(i => i.tcType === 'menu') ])
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
