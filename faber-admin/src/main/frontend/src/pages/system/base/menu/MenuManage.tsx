import React, {useRef, useState} from 'react';
import {RouteComponentProps} from '@reach/router';
import SplitPane from 'react-split-pane';
import {CaretRightOutlined, PlusOutlined} from '@ant-design/icons';
import {Collapse, Descriptions, Empty} from 'antd';
import BaseTree from '@/components/biz/base-tree';
import menuService from '@/services/admin/menu';
import Admin from '@/props/admin';
import {RES_CODE} from '@/configs/server.config';
import MenuModal from './modal/MenuModal';
import {useLocalStorageState} from 'ahooks';
import ElementList from "@/pages/system/base/menu/cube/ElementList";
import MenuBlock from "@/pages/system/base/menu/cube/MenuBlock";
import MenuManageContext, {MenuManageContextProps} from "@/pages/system/base/menu/context/MenuManageContext";


/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function MenuManage(props: RouteComponentProps) {
  const listRef = useRef<any | null>(null);

  const [viewBlock, setViewBlock] = useState<Admin.MenuBlock>();
  const [viewMenu, setViewMenu] = useState<Admin.Menu>();
  const [splitPos, setSplitPos] = useLocalStorageState<number>('MenuManage.splitPos', { defaultValue: 250 });

  /** 点击选中tree节点的事件，这里可以获取点击节点的属性 */
  function onTreeSelect(keys: any[], event: any) {
    if (keys && keys[0]) {
      // 0为根节点
      if (`${keys[0]}` === '0') {
        setViewMenu(undefined);
      } else {
        menuService.findOne(keys[0]).then((res) => {
          if (res && res.status === RES_CODE.OK) {
            setViewMenu(res.data);
          }
        });
      }
    }
  }

  function onAfterDelItem() {
    setViewMenu(undefined);
  }

  const context:MenuManageContextProps = {
    viewBlock,
    changeViewBlock: (v) => setViewBlock(v),
    viewMenu,
    changeViewMenu: (v) => setViewMenu(v),
  }

  return (
    <MenuManageContext.Provider value={context}>
      <div className="faber-full-content faber-flex-column">
        <div style={{ paddingBottom: 6, borderBottom: '1px dashed #ddd' }}>
          <MenuBlock showOprBtn />
        </div>
        <div style={{ flex: 1, position: 'relative', marginTop: 6 }}>
          <div className="faber-full-content-no-padding">
            {viewBlock ? (
                <SplitPane split="vertical" minSize={50} defaultSize={splitPos} onChange={(size) => setSplitPos(size)}>
                  {/* 左侧面板 */}
                  <BaseTree
                    // showRoot
                    showOprBtn
                    onSelect={onTreeSelect}
                    onAfterDelItem={onAfterDelItem}
                    // 自定义配置
                    serviceName="菜单"
                    ServiceModal={MenuModal}
                    serviceApi={{
                      ...menuService,
                      allTree: () => menuService.blockAllTree(viewBlock.id)
                    }}
                    extraEffectArgs={viewBlock.id}
                    extraContextMenus={[
                      {
                        key: 'add-dict',
                        menuTitle: (
                          <>
                            <PlusOutlined /> 新增权限资源
                          </>
                        ),
                        onMenuClick: () => listRef.current.showAddModal(),
                      },
                    ]}
                  />

                  {/* 右侧面板 */}
                  <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'auto' }}>
                    <Collapse
                      bordered={false}
                      // defaultActiveKey={['1']}
                      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                      style={{ marginBottom: 12 }}
                    >
                      <Collapse.Panel header={viewMenu ? `菜单信息 / ${viewMenu.title} / ${viewMenu.code}` : '菜单信息'} key="1" className="site-collapse-custom-panel">
                        {viewMenu ? (
                          <Descriptions bordered size="small">
                            <Descriptions.Item label="菜单名称">{viewMenu.title}</Descriptions.Item>
                            <Descriptions.Item label="权限编码">{viewMenu.code}</Descriptions.Item>
                            <Descriptions.Item label="描述">{viewMenu.description}</Descriptions.Item>
                          </Descriptions>
                        ) : null}
                      </Collapse.Panel>
                    </Collapse>

                    <ElementList ref={listRef} menuId={viewMenu?.id} />
                  </div>
                </SplitPane>
            ) : <Empty description="先选择菜单模块" />}
          </div>
        </div>
      </div>
    </MenuManageContext.Provider>
  );
}
