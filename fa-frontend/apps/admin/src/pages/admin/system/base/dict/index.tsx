import React, {useState} from 'react';
import SplitPane from 'react-split-pane';
import BaseTree from '@/components/base-tree';
import {Empty} from 'antd';
import * as Admin from '@/props/admin';
import dictApi from '@/services/admin/dict';
import {useLocalStorage} from 'react-use';
import DictModal from "./modal/DictModal";
import {FaFlexRestLayout} from "@/components/base-layout";
import {FaSortList} from "@/components/base-drag";
import DictForm from "@/pages/admin/system/base/dict/cube/DictForm";
import {showResponse} from "@/utils/utils";
import {FaLabel} from "@/components/decorator";


/**
 * 字典管理
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictManage() {
  const [viewRecord, setViewRecord] = useState<Admin.Dict>();
  const [splitPos, setSplitPos] = useLocalStorage<number>('DictManage.splitPos', 250);

  function onTreeSelect(keys: any[], event: any) {
    if (keys.length > 0) {
      dictApi.getById(keys[0]).then(res => setViewRecord(res.data))
    } else {
      setViewRecord(undefined)
    }
  }

  function onAfterDelItem() {
    setViewRecord(undefined);
  }

  function refreshData() {
    if (viewRecord === undefined) return;
    dictApi.getById(viewRecord.id).then(res => setViewRecord(res.data))
  }

  function handleChangeDicts(list: any) {
    if (viewRecord === undefined) return;

    const options = [...list, ...viewRecord.options.filter(i => i.deleted)].map((v: any, i: any) => ({ ...v, id: i + 1 }));
    setViewRecord({ ...viewRecord, options: options })
    dictApi.update(viewRecord.id, {
      ...viewRecord,
      options
    }).then(res => {
      showResponse(res, '更新字典排序');
    })
  }

  function handleAddDict(v:any) {
    if (viewRecord === undefined) return;

    const options = viewRecord.options || [];
    dictApi.update(viewRecord.id, {
      ...viewRecord,
      options: [ ...options, { id: options.length + 1, ...v, deleted: false } ]
    }).then(res => {
      showResponse(res, '新增字典');
      refreshData();
    })
  }

  function handleEditDict(v:any) {
    if (viewRecord === undefined) return;

    const options = viewRecord.options.map(d => d.id === v.id ? v : d)
    dictApi.update(viewRecord.id, {
      ...viewRecord,
      options,
    }).then(res => {
      showResponse(res, '更新字典');
      refreshData();
    })
  }

  function handleDelDict(v:any) {
    if (viewRecord === undefined) return;

    const options = viewRecord.options.map(d => d.id === v.id ? { ...v, deleted: true } : d)
    dictApi.update(viewRecord.id, {
      ...viewRecord,
      options,
    }).then(res => {
      showResponse(res, '删除字典');
      refreshData();
    })
  }

  const showDicts = (viewRecord?.options || []).filter(i => !i.deleted)
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
          ServiceModal={DictModal}
          serviceApi={dictApi}
        />

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full">
          {viewRecord ? (
            <div className="fa-flex-column fa-full">
              <FaLabel title={`${viewRecord?.name}/${viewRecord?.code}/${viewRecord?.description || ''}`} className="fa-mb12" />

              <FaFlexRestLayout className="fa-bg-white">
                <div className="fa-flex-row-center fa-bg-grey">
                  <div className="fa-p12 fa-border-b fa-border-r" style={{ flex: 1 }}>字典名称</div>
                  <div className="fa-p12 fa-border-b fa-border-r" style={{ flex: 1 }}>字典值</div>
                  <div className="fa-p12 fa-border-b " style={{ width: 80 }}>操作</div>
                </div>
                <FaSortList
                  list={showDicts}
                  renderItem={(i) => <DictForm dict={i} onChange={handleEditDict} onDelete={handleDelDict} />}
                  itemStyle={{ borderBottom: '1px solid #eee', position: 'relative', cursor: 'default'}}
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
