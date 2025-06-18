import React, { createContext, CSSProperties, ReactNode, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { each, find, get, isNil } from 'lodash';
import { Modal, Space, Spin, Tooltip, Tree } from 'antd';
import { DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { showResponse } from '@ui/utils/utils';
import BaseTreeProps from '@ui/types/core/BaseTreeProps';
import * as TreeUtils from './utils';
import { Fa } from '@ui/types';
import { TreeProps } from 'antd/es/tree';
import { FaHref } from '@ui/components/decorator';
import { Item, ItemParams, Menu, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import useBus from 'use-bus';
import './BaseTree.css';
import { findTreePath } from "@ui/utils";

export interface BaseTreeContextProps {
  renderCount: number;
  updateRenderCount?: () => void;
}

export const BaseTreeContext = createContext<BaseTreeContextProps>({
  renderCount: 1, updateRenderCount: () => {
  }
});
const MENU_ID = 'base-tree-menu';

export interface BaseTreeProp<T, KeyType = number> extends TreeProps {
  showRoot?: boolean; // 是否展示操作按钮
  showTopBtn?: boolean; // 是否展示操作按钮
  showTopAddBtn?: boolean; // 是否展示操作按钮
  showOprBtn?: boolean; // 是否展示操作按钮
  showOprBtnAdd?: boolean; // 是否展示操作按钮
  showOprBtnEdit?: boolean; // 是否展示操作按钮
  showTips?: boolean; // 是否展示操作按钮
  tips?: string; // 是否展示操作按钮
  serviceName?: string; // 业务模块名称
  ServiceModal?: any; // 业务新增、编辑弹框
  className?: any;
  bodyStyle?: CSSProperties; // body补充样式
  treeStyle?: CSSProperties; // body补充样式
  topBarStyle?: CSSProperties; // 顶部工具栏补充样式
  extraContextMenus?: BaseTreeProps.ExtraContextMenus[]; // 外部传入的右键菜单
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有Tree节点 */
    allTree: () => Promise<Fa.Ret<Fa.TreeNode<T, KeyType>[]>>;
    /** [外部定义]改变Tree节点位置 */
    changePos: (list: any[]) => Promise<Fa.Ret>;
    /** [外部定义]获取Tree节点详情 */
    // getById: (id: KeyType) => Promise<Fa.Ret<T>>;
    /** [外部定义]删除Tree节点 */
    remove: (id: KeyType) => Promise<Fa.Ret>;
  };
  onGetTree?: (tree: Fa.TreeNode<T, KeyType>[]) => void; // 每次api拉取tree数据后的回调
  onAfterDelItem?: (item: BaseTreeProps.TreeNode<T, KeyType>) => void;
  rootName?: string;
  renderTreeLabel?: (item: Fa.TreeNode<T, KeyType>) => ReactNode; // 自定义渲染Tree的节点名称
  extraEffectArgs?: any[];
  maxLevel?: number; // 最大的层级，超过这个层级不展示新增按钮
  refreshBusKey?: string; // bus通知刷新key
}

let menuClickItem: any = undefined;

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
const BaseTree = React.forwardRef<HTMLElement, BaseTreeProp<any, any>>(function BaseTree<RecordType extends object = any, KeyType = number>({
   showRoot = false,
   showTopBtn = true,
   showTopAddBtn = true,
   showTips = false,
   showOprBtn = false,
   showOprBtnAdd = true,
   showOprBtnEdit = true,
   serviceName = '',
   className,
   bodyStyle,
   treeStyle,
   topBarStyle,
   ServiceModal = Modal,
   extraContextMenus,
   serviceApi,
   onGetTree,
   onAfterDelItem,
   rootName = Fa.Constant.TREE_SUPER_ROOT_LABEL,
   tips = '右键新增、编辑、删除节点',
   renderTreeLabel,
   extraEffectArgs = [],
   maxLevel,
   refreshBusKey = Fa.Constant.TREE_REFRESH_BUS_KEY,
   ...props
 }: BaseTreeProp<RecordType, KeyType>, ref: any) {
  const {renderCount} = useContext(BaseTreeContext);

  const [loading, setLoading] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [treeData, setTreeData] = useState<Fa.TreeNode<RecordType, KeyType>[]>([]);
  const [clickItem, setClickItem] = useState<BaseTreeProps.TreeNode<RecordType, KeyType>>();
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);

  useEffect(() => {
    fetchTree();
  }, [renderCount, ...extraEffectArgs]);

  useBus(
    [refreshBusKey],
    () => {
      fetchTree();
    },
    [...extraEffectArgs],
  );

  // ------------------------------------------ ref method ------------------------------------------
  useImperativeHandle(ref, () => ({
    /**
     * 展开指定的keys
     * @param key
     */
    expandKeys: (key: KeyType) => handleExpandKey(key),
  }));

  // ------------------------------------------ context menu ------------------------------------------
  const {show} = useContextMenu({
    id: MENU_ID,
  });

  function handleContextMenu(event: any, props: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    // 默认根节点无右键菜单
    // if (event) {
    //   event.preventDefault()
    //   event.stopPropagation()
    // }
    if (props.value === Fa.Constant.TREE_SUPER_ROOT_ID) return;
    if (!showOprBtn) return;
    setClickItem(props);
    menuClickItem = props;
    show({event, props});
  }

  // I'm using a single event handler for all items
  // but you don't have too :)
  const handleItemClick = ({id, props}: ItemParams) => {
    const item = props as BaseTreeProps.TreeNode<RecordType, KeyType>;
    switch (id) {
      case 'add':
        handleAddItem(item);
        break;
      case 'edit':
        handleEditItem(item);
        break;
      case 'del':
        confirmDelItem(item);
        break;
    }
  };

  function handleAddItem(item?: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    setClickItem(item);
    setEditItemModalVisible(false);
    setAddItemModalVisible(true);
  }

  function handleEditItem(item: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    setClickItem(item);
    setAddItemModalVisible(false);
    setEditItemModalVisible(true);
  }

  function handleDelItem(item: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    return serviceApi.remove(item.value).then((res) => {
      showResponse(res, `删除${serviceName}`);
      fetchTree();
      if (onAfterDelItem) onAfterDelItem(item);
    });
  }

  function confirmDelItem(item: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    Modal.confirm({
      title: '删除确认',
      content: `确认删除${serviceName}【${item.label}】？`,
      okText: '删除',
      okButtonProps: {type: 'primary', danger: true},
      onOk: () => handleDelItem(item),
      cancelText: '取消',
    });
  }

  const handleExtraItemClick = (e: ItemParams, extraMenu: BaseTreeProps.ExtraContextMenus) => {
    const item = e.props as BaseTreeProps.TreeNode<RecordType>;
    extraMenu.onMenuClick(e, item);
  };

  // ------------------------------------------ context menu ------------------------------------------

  function fetchTree() {
    setLoading(true);
    serviceApi.allTree().then((res) => {
      let treeArr: any[] = TreeUtils.parseNode<RecordType>(res.data) || [];
      if (showRoot) {
        treeArr = [{...Fa.ROOT_DEFAULT, name: rootName, level: 0, children: treeArr}] as any[];
      }
      // const newTreeData = renderTreeData(treeArr);
      setTreeData(treeArr);
      if (expandedKeys === undefined || expandedKeys.length === 0) {
        if (showRoot) { // 默认展开全部
          setExpandedKeys([0]);
        } else {
          if (props.selectedKeys && props.selectedKeys[0]) { // 如果有指定的选中key，默认展示选中的key
            const traceKey = props.selectedKeys[0];
            const treePath = findTreePath(treeArr, i => i.id === traceKey)
            const keys: any[] = treePath.map(i => i.id)
            setExpandedKeys(keys)
          }
        }
      }

      if (onGetTree) onGetTree(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  function handleExpandKey(key: KeyType) {
    const treePath = findTreePath(treeData, i => i.id === key)
    // console.log('treePath', treePath)
    const keys: any[] = treePath.map(i => i.id)

    const newEks = [...expandedKeys]
    each(keys, v => {
      if (!newEks.includes(v)) {
        newEks.push(v)
      }
    })
    setExpandedKeys(newEks)
  }

  function afterEditItem() {
    setClickItem(undefined);
    setAddItemModalVisible(false);
    setEditItemModalVisible(false);
    fetchTree();
  }

  function onDrop(info: any) {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // console.log(info, 'info.dropToGap', info.dropToGap, 'dropKey', dropKey, 'dragKey', dragKey, 'dropPos', dropPos, 'dropPosition', dropPosition)

    // 生成新的排序tree
    const newTree = TreeUtils.dropItem(
      treeData,
      dragKey,
      dropKey,
      dropPosition,
      info.dropToGap,
      info.node.props.children,
      info.node.props.expanded,
    );
    setTreeData(newTree);

    // 触发更新排序
    const oldTreeFlat = TreeUtils.flatTree(treeData);
    const newTreeFlat = TreeUtils.flatTree(newTree);

    // 筛选出sort、pid变更的节点
    const changeItems: any[] = [];
    each(oldTreeFlat, (item) => {
      const newItem = find(newTreeFlat, (n) => n.key === item.key);
      if (newItem === undefined) {
        return;
      }
      if (newItem.index !== item.index || newItem.pid !== item.pid) {
        changeItems.push(newItem);
      }
    });

    // api update
    serviceApi.changePos(changeItems).then(() => {
      fetchTree();
    });
  }

  function handleExpandAll() {
    const flatTree = TreeUtils.flatTree(treeData);
    setExpandedKeys(flatTree.map((i) => i.key));
  }

  function canShowAddBtn(): boolean {
    if (isNil(maxLevel)) return true;
    if (isNil(menuClickItem)) return false;
    return menuClickItem.level < maxLevel;
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--fa-bg-color)',
        display: 'flex',
        flexDirection: 'column',
        ...bodyStyle,
      }}
    >
      {/* top tools */}
      {showTopBtn && (
        <div style={{padding: 12, display: 'flex', alignItems: 'center', ...topBarStyle}}>
          <div style={{flex: 1}}>
            {showTopAddBtn && (
              <FaHref onClick={() => handleAddItem()} text={`新增${serviceName}`}/>
            )}
          </div>
          <div>
            <Tooltip title="刷新" mouseEnterDelay={1}>
              <a onClick={() => fetchTree()} className="fa-link-btn"><ReloadOutlined/></a>
            </Tooltip>
            <Tooltip title="折叠" mouseEnterDelay={1}>
              <a onClick={() => setExpandedKeys([])} className="fa-link-btn"><MinusCircleOutlined/></a>
            </Tooltip>
            <Tooltip title="展开" mouseEnterDelay={1}>
              <a onClick={() => handleExpandAll()} className="fa-link-btn"><PlusCircleOutlined/></a>
            </Tooltip>
          </div>
        </div>
      )}

      {/* main tree */}
      <div className="fa-base-tree-div" style={{flex: 1, overflowY: 'auto'}}>
        <div style={{paddingRight: 12, ...treeStyle}}>
          <Spin spinning={loading}>
            <Tree
              blockNode
              showLine={{showLeafIcon: false}}
              treeData={treeData as any[]}
              draggable={{icon: false}}
              onDrop={onDrop}
              expandedKeys={expandedKeys}
              onExpand={(eks) => setExpandedKeys(eks)}
              fieldNames={{key: 'id', title: 'name'}}
              titleRender={(item: any) => (
                <div className="fa-base-tree-title-div" onContextMenu={(e) => handleContextMenu(e, item)}>
                  {renderTreeLabel ? renderTreeLabel(item) : `${item.name}`}
                </div>
              )}
              {...props}
            />

            <ServiceModal
              title={`新增${serviceName}`}
              parentId={clickItem && get(clickItem, 'value')}
              open={addItemModalVisible}
              onCancel={afterEditItem}
              fetchFinish={afterEditItem}
            />

            <ServiceModal
              title={`编辑${serviceName}`}
              open={editItemModalVisible}
              record={clickItem ? clickItem.sourceData : undefined}
              onCancel={afterEditItem}
              fetchFinish={afterEditItem}
              destroyOnClose
            />
          </Spin>
        </div>
      </div>

      {/* context menu */}
      <Menu id={MENU_ID} className="contextMenu">
        {canShowAddBtn() && showOprBtnAdd && (
          <Item id="add" onClick={handleItemClick}>
            <PlusOutlined style={{width: 20}}/> 新增
          </Item>
        )}
        {showOprBtnEdit && (
          <Item id="edit" onClick={handleItemClick}>
            <EditOutlined style={{width: 20}}/> 编辑
          </Item>
        )}
        {extraContextMenus?.map((em) => (
          <Item id={em.key} key={em.key} onClick={(e: any) => handleExtraItemClick(e, em)}>
            <span style={{width: 20}}>{em.icon && em.icon}</span>
            {em.title}
          </Item>
        ))}
        {showOprBtnEdit && (
          <Item id="del" onClick={handleItemClick}>
            <span style={{color: '#F00'}}>
              <DeleteOutlined style={{width: 16}}/> 删除
            </span>
          </Item>
        )}
      </Menu>

      {showTips && <div style={{padding: 12, color: '#aaa'}} className="fa-bg-white">{tips}</div>}
    </div>
  );
})

export default BaseTree;
