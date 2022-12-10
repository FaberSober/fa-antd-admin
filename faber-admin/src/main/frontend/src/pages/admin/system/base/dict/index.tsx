import React, {useState} from 'react';
import SplitPane from 'react-split-pane';
import BaseTree from '@/components/base-tree';
import {Descriptions, Empty} from 'antd';
import Admin from '@/props/admin';
import dictTypeApi from '@/services/admin/dictType';
import {useLocalStorage} from 'react-use';
import DictTypeModal from "./modal/DictTypeModal";
import {FaFlexRestLayout} from "@/components/base-layout";
import {FaSortList} from "@/components/base-drag";
import DictForm from "@/pages/admin/system/base/dict/cube/DictForm";
import {showResponse} from "@/utils/utils";


/**
 * 字典管理
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictManage() {
  const [viewRecord, setViewRecord] = useState<Admin.DictType>();
  const [splitPos, setSplitPos] = useLocalStorage<number>('DictManage.splitPos', 250);

  function onTreeSelect(keys: any[], event: any) {
    if (keys.length > 0) {
      dictTypeApi.getById(keys[0]).then(res => setViewRecord(res.data))
    } else {
      setViewRecord(undefined)
    }
  }

  function onAfterDelItem() {
    setViewRecord(undefined);
  }

  function refreshData() {
    if (viewRecord === undefined) return;
    dictTypeApi.getById(viewRecord.id).then(res => setViewRecord(res.data))
  }

  function handleChangeDicts(list: any) {
    if (viewRecord === undefined) return;

    const dicts = list.map((v: any, i: any) => ({ ...v, id: i + 1 }));
    setViewRecord({ ...viewRecord, dicts })
    dictTypeApi.update(viewRecord.id, {
      ...viewRecord,
      dicts
    }).then(res => {
      showResponse(res, '更新字典排序');
    })
  }

  function handleAddDict(v:any) {
    if (viewRecord === undefined) return;

    const dicts = viewRecord.dicts || [];
    dictTypeApi.update(viewRecord.id, {
      ...viewRecord,
      dicts: [ ...dicts, { id: dicts.length + 1, ...v, deleted: false } ]
    }).then(res => {
      showResponse(res, '新增字典');
      refreshData();
    })
  }

  function handleEditDict(v:any) {
    if (viewRecord === undefined) return;

    const dicts = viewRecord.dicts.map(d => d.id === v.id ? v : d)
    dictTypeApi.update(viewRecord.id, {
      ...viewRecord,
      dicts,
    }).then(res => {
      showResponse(res, '更新字典');
      refreshData();
    })
  }

  function handleDelDict(v:any) {
    if (viewRecord === undefined) return;

    const dicts = viewRecord.dicts.map(d => d.id === v.id ? { ...v, deleted: true } : d)
    dictTypeApi.update(viewRecord.id, {
      ...viewRecord,
      dicts,
    }).then(res => {
      showResponse(res, '删除字典');
      refreshData();
    })
  }

  const showDicts = (viewRecord?.dicts || []).filter(i => !i.deleted)
  return (
    <div className="fa-full-content">
      <SplitPane split="vertical" minSize={200} maxSize={350} defaultSize={splitPos} onChange={(size) => setSplitPos(size)}>
        {/* 左侧面板 */}
        <BaseTree
          // showRoot
          showOprBtn
          onSelect={onTreeSelect}
          onAfterDelItem={onAfterDelItem}
          // 自定义配置
          serviceName="字典分组"
          ServiceModal={DictTypeModal}
          serviceApi={dictTypeApi}
        />

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full">
          {viewRecord ? (
            <div className="fa-flex-column fa-full">
              <Descriptions className="fa-bg-white fa-mb12 fa-p12" bordered size="small" labelStyle={{ width: 150 }} contentStyle={{ minWidth: 100 }}>
                <Descriptions.Item label="字典分组名称">{viewRecord?.name}</Descriptions.Item>
                <Descriptions.Item label="字典分组编码">{viewRecord?.code}</Descriptions.Item>
                <Descriptions.Item label="描述">{viewRecord?.description}</Descriptions.Item>
              </Descriptions>

              <FaFlexRestLayout className="fa-bg-white">
                <div className="fa-flex-row-center fa-bg-grey">
                  <div className="fa-p12 fa-border-b fa-border-r" style={{ flex: 1 }}>字典名称</div>
                  <div className="fa-p12 fa-border-b fa-border-r" style={{ flex: 1 }}>字典值</div>
                  <div className="fa-p12 fa-border-b " style={{ width: 80 }}>操作</div>
                </div>
                <FaSortList
                  list={showDicts}
                  renderItem={(i) => <DictForm dict={i} onChange={handleEditDict} onDelete={handleDelDict} />}
                  itemStyle={{ borderBottom: '1px solid #eee', position: 'relative'}}
                  onSortEnd={(l) => handleChangeDicts(l)}
                  vertical
                  handle
                  handleStyle={{ position: 'absolute', right: 10, top: 14 }}
                />
                <DictForm onChange={handleAddDict} />


              </FaFlexRestLayout>
            </div>
          ) : <Empty description="请先选择字典分组" />}
        </div>
      </SplitPane>
    </div>
  );
}
