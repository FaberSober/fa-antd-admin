import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Fa, FaFlexRestLayout, FaSortList, FaUtils, useApiLoading, useExportBase } from "@fa/ui";
import { CommonExcelUploadModal } from "@features/fa-admin-pages/components";
import { dictDataApi } from "@features/fa-admin-pages/services";
import { Admin } from "@features/fa-admin-pages/types";
import { Button, Space } from "antd";
import { useEffect, useState } from 'react';
import DictDataForm from "./DictDataForm";


export interface DictDataOptionsProps {
  dictId: number;
}

/**
 * @author xu.pengfei
 * @date 2025/7/11 14:49
 */
export default function DictDataOptions({ dictId }: DictDataOptionsProps) {
  const [array, setArray] = useState<Admin.DictData[]>([])

  const [exporting, fetchExportExcel] = useExportBase(dictDataApi.exportExcel, { query: { dictId } })

  useEffect(() => {
    fetchData()
  }, [dictId])

  function fetchData() {
    dictDataApi.list({ query: {dictId}, sorter: 'sort_id ASC' }).then((res) => {
      setArray(res.data);
    });
  }

  function handleChangeList(list: Admin.DictData[]) {
    console.log('change', list)
    setArray(list)
    const changeList: Fa.TreePosChangeVo[] = []
    list.forEach((item, index) => {
      if (item.sortId !== index) {
        changeList.push({ key: item.id, pid: item.parentId, index })
      }
    })
    dictDataApi.changePos(changeList)
  }

  function handleAdd(v: Admin.DictData) {
    dictDataApi.save({...v, dictId}).then((res) => {
      FaUtils.showResponse(res, '新增字典');
      fetchData()
    });
  }

  function handleEdit(v: Admin.DictData) {
    console.log('edit', v)
    dictDataApi.update(v.id, v).then((res) => {
      FaUtils.showResponse(res, '更新字典');
      fetchData()
    });
  }

  function handleDel(v: Admin.DictData) {
    dictDataApi.remove(v.id).then((res) => {
      FaUtils.showResponse(res, '删除字典');
      fetchData()
    });
  }

  const loading = useApiLoading([dictDataApi.getUrl('list')])
  return (
    <FaFlexRestLayout className="fa-bg-white">
      <Space className="fa-mb12">
        <Button onClick={fetchData} loading={loading}>
          刷新
        </Button>
        <Button icon={<DownloadOutlined />} onClick={fetchExportExcel} loading={exporting}>导出</Button>
        <CommonExcelUploadModal
          fetchFinish={fetchData}
          apiDownloadTplExcel={dictDataApi.exportTplExcel}
          apiImportExcel={dictDataApi.importExcel}
          type={`base_dict_data-${dictId}`}
        >
          <Button icon={<UploadOutlined />}>上传</Button>
        </CommonExcelUploadModal>
      </Space>

      <div className="fa-flex-row-center fa-bg-grey">
        <div className="fa-dict-data-title fa-border-b fa-border-r" style={{ flex: 1 }}>
          字典名称
        </div>
        <div className="fa-dict-data-title fa-border-b fa-border-r" style={{ flex: 1 }}>
          字典值
        </div>
        <div className="fa-dict-data-title fa-border-b fa-border-r fa-text-center" style={{ width: 100 }}>
          是否默认
        </div>
        <div className="fa-dict-data-title fa-border-b fa-border-r fa-text-center" style={{ width: 100 }}>
          是否生效
        </div>
        <div className="fa-dict-data-title fa-border-b fa-border-r" style={{ flex: 1 }}>
          描述
        </div>
        <div className="fa-dict-data-title fa-border-b " style={{ width: 80 }}>
          操作
        </div>
      </div>
      <FaSortList
        list={array}
        renderItem={(i) => <DictDataForm dict={i} onChange={handleEdit} onDelete={handleDel} />}
        itemStyle={{ borderBottom: '1px solid var(--fa-border-color)', position: 'relative', cursor: 'default' }}
        onSortEnd={(l) => handleChangeList(l)}
        vertical
        handle
        handleStyle={{ position: 'absolute', right: 10, top: 7 }}
      />
      <DictDataForm onChange={handleAdd} />
    </FaFlexRestLayout>
  )
}
