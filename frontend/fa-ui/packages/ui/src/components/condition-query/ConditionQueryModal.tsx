import React, { ReactNode, useState } from 'react';
import { trim } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox, Divider, Input, message } from 'antd';
import { DragModal } from '@ui/components/base-modal';
import ConditionQuery from './ConditionQuery';
import {configApi, configSceneApi} from '@ui/services/base';
import { Admin } from '@ui/types';
import { showResponse } from '@ui/utils/utils';
import { FaberTable } from '@ui/components/base-table';
import CondGroupShow from '@ui/components/condition-query/CondGroupShow';
import CondGroupEdit from '@ui/components/condition-query/CondGroupEdit';
import { PlusOutlined } from '@ant-design/icons';
import { needValue } from "@ui/components/condition-query/utils";

export interface ConditionQueryModalProps<T> {
  showSuffix?: boolean;
  biz: string; // 业务模块
  record?: Admin.ConfigScene; // 远程业务配置
  onConditionChange?: (conditionList: ConditionQuery.CondGroup[], saveAsScene: boolean) => void; // 保存成功的回调
  columns: FaberTable.ColumnsProp<T>[];
  children: ReactNode;
}

function genOneEmptyCondGroup(): ConditionQuery.CondGroup {
  return {
    id: uuidv4(),
    type: ConditionQuery.Type.AND,
    condList: [{ id: uuidv4(), opr: ConditionQuery.CondOpr.equal }],
  };
}

/**
 * 表格自定义列Modal
 *
 {
        title: '创建时间',
        dataIndex: 'crtTime',
        sorter: true,
        sortOrder: getSortOrder(sorter, 'crtTime'),
        tcChecked: true,
        tcCondComponent: ConditionQueryModal.renderTimePicker,
        tcCondBetweenComponent: ConditionQueryModal.renderTimeRangerPicker,
        tcConditionHide: false, // 是否在查询面板中隐藏
        width: 180,
      },
 */
export default function ConditionQueryModal<T>({
  showSuffix,
  biz,
  record,
  onConditionChange,
  columns,
  children,
}: ConditionQueryModalProps<T>) {
  const [condGroupList, setCondGroupList] = useState<ConditionQuery.CondGroup[]>(
    record ? record.data : [genOneEmptyCondGroup()],
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveAsScene, setSaveAsScene] = useState(record !== undefined);
  const [defaultScene] = useState(false); // 是否设置为默认场景
  const [sceneName, setSceneName] = useState<string | undefined>(record?.name);

  /** 处理-增加item */
  async function handleSave() {
    // 校验筛选条件
    for (let j = 0; j < condGroupList.length; j += 1) {
      const { condList } = condGroupList[j];

      for (let i = 0; i < condList.length; i += 1) {
        const cond = condList[i];
        const { key, opr, value, begin, end } = cond;
        // 是否需要右侧筛选值
        const showValue = needValue(opr)
        if (key === undefined) {
          message.error('请选择筛选字段');
          return;
        }
        if (opr === undefined) {
          message.error('请选择筛选条件');
          return;
        }
        if (opr === 'between') {
          if (begin === undefined) {
            message.error('请输入起始值');
            return;
          }
          if (end === undefined) {
            message.error('请输入结束值');
            return;
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (showValue && value === undefined) {
            message.error('请输入筛选条件的值');
            return;
          }
        }
      }
    }

    // 判断是否保存为场景
    if (condGroupList.length > 0 && saveAsScene) {
      if (sceneName === undefined || trim(sceneName) === '') {
        message.error('请输入场景名称');
        return;
      }

      const params = {
        biz,
        name: sceneName,
        data: condGroupList,
        system: false,
        defaultScene,
      };
      setLoading(true);
      if (record) {
        const response = await configSceneApi.update(record.id, { ...record, ...params });
        showResponse(response, '更新场景');
      } else {
        const response = await configSceneApi.save(params);
        showResponse(response, '新增场景');
      }
      setLoading(false);
    }

    if (onConditionChange) {
      onConditionChange(condGroupList, saveAsScene);
    }
    setOpen(false);
  }

  function handleCondGroupChange(condGroup: ConditionQuery.CondGroup, triggerSave?: boolean) {
    const newList = condGroupList.map((c) => {
      if (c.id === condGroup.id) return condGroup;
      return c;
    });
    setCondGroupList(newList);
    if (triggerSave) {
      if (onConditionChange) {
        onConditionChange(newList, false);
      }
    }
  }

  function handleAddCondGroup() {
    setCondGroupList([...condGroupList, genOneEmptyCondGroup()]);
  }

  function handleDeleteCondGroup(condGroup: ConditionQuery.CondGroup) {
    setCondGroupList(condGroupList.filter((c) => c.id !== condGroup.id));
  }

  const inEdit = record !== undefined;
  return (
    <span>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span onClick={() => setOpen(true)}>{children}</span>
        {/* 高级筛选结果展示 */}
        {showSuffix ? (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {condGroupList.map((condGroup, index) => (
              <div key={condGroup.id} className="fa-flex-row-center">
                <CondGroupShow condGroup={condGroup} onChange={handleCondGroupChange} />
                {index < condGroupList.length - 1 && <Divider type="vertical" />}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <DragModal
        title="高级筛选"
        open={open}
        onOk={handleSave}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={750}
        destroyOnClose
      >
        <div>
          {condGroupList.map((condGroup) => {
            return (
              <CondGroupEdit
                key={condGroup.id}
                condGroup={condGroup}
                columns={columns}
                onChange={handleCondGroupChange}
                onDelete={() => handleDeleteCondGroup(condGroup)}
              />
            );
          })}

          <div style={{ marginBottom: 12 }}>
            <a onClick={handleAddCondGroup}>
              <PlusOutlined /> 添加条件分组
            </a>
          </div>
          {/*<Alert type="info" description="1. IN查询用英文逗号(,)进行分隔查询；" style={{ marginTop: 8 }} />*/}

          {/* 保存为场景 */}
          <div style={{ display: 'flex', alignItems: 'center', height: 40, marginTop: 12 }}>
            {!inEdit && (
              <Checkbox
                disabled={record !== undefined}
                checked={saveAsScene}
                onChange={(e) => setSaveAsScene(e.target.checked)}
              >
                保存为场景
              </Checkbox>
            )}
            {saveAsScene || inEdit ? (
              <Input
                value={sceneName}
                onChange={(e) => setSceneName(e.target.value)}
                style={{ width: 200 }}
                placeholder="请输入场景名称"
                maxLength={30}
              />
            ) : null}
          </div>
          {/*{(saveAsScene || inEdit) ? (*/}
          {/*  <div style={{ marginTop: 12 }}>*/}
          {/*    <Checkbox checked={defaultScene} onChange={e => setDefaultScene(e.target.checked)}>*/}
          {/*      设置为默认*/}
          {/*    </Checkbox>*/}
          {/*  </div>*/}
          {/*) : null}*/}
        </div>
      </DragModal>
    </span>
  );
}
