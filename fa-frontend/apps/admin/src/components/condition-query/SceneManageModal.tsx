import React, {useImperativeHandle, useState} from 'react';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import configService from '@/services/admin/configScene';
import {showResponse} from '@/utils/utils';
import {EditOutlined} from '@ant-design/icons';
import {Checkbox, Space} from 'antd';
import * as Admin from '../../../types/admin';
import ConditionQueryModal from '@/components/condition-query/ConditionQueryModal';
import {FaberTable} from '@/components/base-table';
import styles from './SceneManageModal.module.less';
import {FaSortList} from "@/components/base-drag";
import {AuthDelBtn} from "@/components/decorator";


interface IProps<T> extends DragModalProps {
  biz: string;
  columns: FaberTable.ColumnsProp<T>[];
  onOk?: () => void;
}

/**
 * 管理保存的查询场景：
 * 1. 场景排序；
 * 2. 场景编辑、删除；
 */
function SceneManageModal<T>({ biz, columns, onOk, ...restProps }: IProps<T>, ref: any) {
  const [loading, setLoading] = useState(false);
  const [configList, setConfigList] = useState<Admin.ConfigScene[]>([]);

  useImperativeHandle(ref, () => ({
    fetchRemoteConfig: () => {
      fetchRemoteConfig();
    },
  }));

  /** 获取远程配置 */
  function fetchRemoteConfig() {
    if (biz === undefined) return;
    configService.findAllScene({ biz }).then((res) => {
      setConfigList(res.data);
    });
  }

  /** 处理-增加item */
  async function handleSave() {
    setLoading(true);
    const params = configList.map((item, index) => ({ ...item, sort: index + 1 }));
    const res = await configService.updateBatch(params);
    showResponse(res, '更新场景配置');
    if (onOk) onOk();
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
  function handleItemCheck(item: Admin.ConfigScene, checked: boolean) {
    const newList = configList.map((i) => {
      if (i.id === item.id) {
        return { ...i, hide: !checked };
      }
      return i;
    });
    setConfigList(newList);
  }

  return (
    <DragModal title="管理场景" onOk={handleSave} confirmLoading={loading} width={700} destroyOnClose {...restProps}>
      <div>
        <div style={{ display: 'flex', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#eee', padding: 8 }}>
          <div style={{ width: 40 }}>展示</div>
          <div style={{ flex: 1, paddingLeft: 8 }}>场景名称</div>
          <div>操作</div>
        </div>

        <FaSortList
          list={configList}
          renderItem={(item) => (
            <div className={styles.itemContainer}>
              <Checkbox
                style={{ width: 40 }}
                disabled={item.system}
                checked={item.system || !item.hide}
                onChange={(e) => handleItemCheck(item, e.target.checked)}
              />
              <div style={{ flex: 1, paddingLeft: 8 }}>
                <strong>{item.name}</strong>
              </div>
              {item.system ? <span style={{ color: '#666', marginRight: 16 }}>（系统场景）</span> : null}
              <div>
                {item.system ? null : (
                  <Space>
                    <ConditionQueryModal record={item} biz={biz} columns={columns} onConditionChange={fetchRemoteConfig} showSuffix={false}>
                      <a>
                        <EditOutlined /> 编辑
                      </a>
                    </ConditionQueryModal>
                    <AuthDelBtn handleDelete={() => handleDelete(item.id)} />
                  </Space>
                )}
              </div>
            </div>
          )}
          itemStyle={{ borderBottom: '1px solid #ccc'}}
          onSortEnd={(l) => setConfigList(l)}
          vertical
          handle
        />
      </div>
    </DragModal>
  );
}

export default React.forwardRef(SceneManageModal);
