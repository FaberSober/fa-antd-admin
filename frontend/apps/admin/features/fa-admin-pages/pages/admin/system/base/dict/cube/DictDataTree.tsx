import { DownloadOutlined, EditOutlined, PlusOutlined, SisternodeOutlined, UploadOutlined } from '@ant-design/icons';
import { AuthDelBtn, BaseTree, type Fa, FaFlexRestLayout, FaHref, useApiLoading, useDelete, useExportBase } from '@fa/ui';
import { CommonExcelUploadModal } from "@features/fa-admin-pages/components";
import DictDataIsDefaultSwitch from "@features/fa-admin-pages/pages/admin/system/base/dict/cube/DictDataIsDefaultSwitch";
import DictDataValidSwitch from "@features/fa-admin-pages/pages/admin/system/base/dict/cube/DictDataValidSwitch";
import { dictDataApi as api, dictDataApi } from '@features/fa-admin-pages/services';
import { Admin } from "@features/fa-admin-pages/types";
import { Button, Space } from 'antd';
import { useEffect } from 'react';
import { useCounter } from 'react-use';
import DictDataModal from '../modal/DictDataModal';


interface DictDataTreeProps {
  dictId: number;
}

export default function DictDataTree({ dictId }: DictDataTreeProps) {
  const [current, { inc }] = useCounter(0);

  useEffect(() => {
    refreshData();
  }, []);

  function refreshData() {
    inc();
  }

  const [handleDelete] = useDelete<number>(dictDataApi.remove, refreshData, '菜单');
  const [exporting, fetchExportExcel] = useExportBase(api.exportExcel, { query: { dictId } })

  const loadingTree = useApiLoading([dictDataApi.getUrl('allTree')]);
  return (
    <div className="fa-full-content fa-flex-column fa-menu-div">
      <Space className="fa-mb12">
        <Button onClick={refreshData} loading={loadingTree}>
          刷新
        </Button>
        <DictDataModal title="新增字典" dictId={dictId} type="tree" fetchFinish={refreshData}>
          <Button type="primary" icon={<PlusOutlined/>} loading={loadingTree}>
            新增字典
          </Button>
        </DictDataModal>
        <Button icon={<DownloadOutlined />} onClick={fetchExportExcel} loading={exporting}>导出</Button>
        <CommonExcelUploadModal
          fetchFinish={refreshData}
          apiDownloadTplExcel={api.exportTplExcel}
          apiImportExcel={api.importExcel}
          type={`base_dict_data-${dictId}`}
        >
          <Button icon={<UploadOutlined />}>上传</Button>
        </CommonExcelUploadModal>
      </Space>

      <div className="fa-flex-row-center fa-bg-grey">
        <div className="fa-dict-data-title fa-border-b fa-border-r" style={{flex: 1}}>
          字典名称
        </div>
        <div className="fa-dict-data-title fa-border-b fa-border-r" style={{width: 200}}>
          字典值
        </div>
        <div className="fa-dict-data-title fa-border-b fa-border-r fa-text-center" style={{width: 80}}>
          是否默认
        </div>
        <div className="fa-dict-data-title fa-border-b fa-border-r fa-text-center" style={{width: 80}}>
          是否生效
        </div>
        <div className="fa-dict-data-title fa-border-b fa-border-r" style={{width: 200}}>
          描述
        </div>
        <div className="fa-dict-data-title fa-border-b " style={{width: 220}}>
          操作
        </div>
      </div>

      <FaFlexRestLayout>
        <BaseTree
          // showRoot
          showOprBtn
          // onSelect={(keys) => console.log('onSelect', keys)}
          onAfterDelItem={() => {
          }}
          // 自定义配置
          serviceName="Tree"
          serviceApi={{
            ...dictDataApi,
            allTree: () => dictDataApi.getTree({query: {dictId}}),
          }}
          bodyStyle={{width: '100%', height: '100%'}}
          showTips={false}
          showTopBtn={false}
          // @ts-ignore
          titleRender={(item: Fa.TreeNode<Admin.DictData, number> & { updating: boolean }) => (
            <div className="fa-menu-item" style={{marginRight: -8}}>
              <div style={{flex: 1}}>{item.sourceData.label}</div>
              <div style={{width: 200}}>
                {item.sourceData.value}
              </div>
              <div className="fa-dict-data-title fa-text-center" style={{width: 80}}>
                <DictDataIsDefaultSwitch item={item.sourceData} onChange={refreshData} />
              </div>
              <div className="fa-dict-data-title fa-text-center" style={{width: 80}}>
                <DictDataValidSwitch item={item.sourceData} onChange={refreshData} />
              </div>
              <div className="fa-dict-data-title" style={{width: 200}}>
                {item.sourceData.description}
              </div>
              <Space style={{width: 220}}>
                <DictDataModal title="新增菜单" dictId={item.sourceData.dictId} type="tree" parentId={item.sourceData.id} fetchFinish={refreshData}>
                  <FaHref icon={<SisternodeOutlined/>} text="新增子节点"/>
                </DictDataModal>
                <DictDataModal
                  dictId={dictId}
                  type="tree"
                  title="编辑菜单"
                  record={item.sourceData}
                  fetchFinish={refreshData}
                >
                  <FaHref icon={<EditOutlined/>} text="编辑"/>
                </DictDataModal>
                <AuthDelBtn handleDelete={() => handleDelete(item.id)}/>
              </Space>
            </div>
          )}
          showLine={false}
          draggable
          extraEffectArgs={[current]}
        />
      </FaFlexRestLayout>
    </div>
  );
}
