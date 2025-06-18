import React, { useImperativeHandle, useState } from 'react';
import { DragModal, DragModalProps } from '@ui/components/base-modal';
import {configSceneApi} from '@ui/services/base';
import { showResponse } from '@ui/utils/utils';
import { EditOutlined } from '@ant-design/icons';
import { Checkbox, Space } from 'antd';
import { Admin } from '@ui/types';
import ConditionQueryModal from '@ui/components/condition-query/ConditionQueryModal';
import { FaberTable } from '@ui/components/base-table';
import './SceneManageModal.css';
import {FaSortList} from "@ui/components/base-drag";
import {AuthDelBtn} from "@ui/components/decorator";

export interface SceneManageModalProps<T> extends DragModalProps {
  biz: string;
  columns: FaberTable.ColumnsProp<T>[];
  onOk?: () => void;
}

/**
 * 管理保存的查询场景：
 * 1. 场景排序；
 * 2. 场景编辑、删除；
 */
const SceneManageModal = React.forwardRef<HTMLElement, SceneManageModalProps<any>>(function SceneManageModal<T>({ biz, columns, onOk, ...restProps }: SceneManageModalProps<T>, ref: any) {
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
    configSceneApi.findAllScene({ biz }).then((res) => {
      setConfigList(res.data);
    });
  }

  /** 处理-增加item */
  async function handleSave() {
    setLoading(true);
    const params = configList.map((item, index) => ({ ...item, sort: index + 1 }));
    const res = await configSceneApi.updateBatch(params);
    showResponse(res, '更新场景配置');
    if (onOk) onOk();
    setLoading(false);
  }

  /** 删除Item */
  function handleDelete(id: number) {
    configSceneApi.remove(id).then((res) => {
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
        <div className="fa-scene-title">
          <div style={{ width: 40 }}>展示</div>
          <div style={{ flex: 1, paddingLeft: 8 }}>场景名称</div>
          <div>操作</div>
        </div>

        <FaSortList
          list={configList}
          renderItem={(item) => (
            <div className="fa-scene-item">
              <Checkbox
                style={{ width: 40 }}
                disabled={item.system}
                checked={item.system || !item.hide}
                onChange={(e) => handleItemCheck(item, e.target.checked)}
              />
              <div style={{ flex: 1, paddingLeft: 8 }}>
                <div className="fa-h3">{item.name}</div>
              </div>
              {item.system ? <span style={{ color: '#666', marginRight: 16 }}>（系统场景）</span> : null}
              <div>
                {item.system ? null : (
                  <Space>
                    <ConditionQueryModal
                      record={item}
                      biz={biz}
                      columns={columns}
                      onConditionChange={fetchRemoteConfig}
                      showSuffix={false}
                    >
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
          itemStyle={{ borderBottom: '1px solid #ccc' }}
          onSortEnd={(l) => setConfigList(l)}
          vertical
          handle
        />
      </div>
    </DragModal>
  );
})

export default SceneManageModal;
