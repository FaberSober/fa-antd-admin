import React, {createContext, CSSProperties, ReactNode, useContext, useEffect, useMemo, useState} from 'react';
import {each, find, get} from 'lodash';
import {Modal, Space, Spin, Tree} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {RES_CODE} from '@/configs/server.config';
import {showResponse} from '@/utils/utils';
import BaseTreeProps from './interface';
import * as BaseTreeUtils from './utils';
import Fa from '@/props/base/Fa';
import {TreeProps} from 'antd/es/tree';
import {FaHref} from "@/components/decorator";
import styles from './index.module.less';
import {Menu, Item, useContextMenu, ItemParams} from "react-contexify";
import 'react-contexify/ReactContexify.css';


export interface BaseTreeContextProps {
  renderCount: number;
  updateRenderCount: () => void;
}

export const BaseTreeContext = createContext<BaseTreeContextProps>({ renderCount: 1, updateRenderCount: () => {} })
const MENU_ID = 'base-tree-menu';

interface IProps<T, KeyType = number> extends TreeProps {
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
  extraContextMenus?: BaseTreeProps.ExtraContextMenus[]; // 外部传入的右键菜单
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有Tree节点 */
    allTree: () => Promise<Fa.Ret<Fa.TreeNode<T, KeyType>[]>>;
    /** [外部定义]改变Tree节点位置 */
    changePos: (list: any[]) => Promise<Fa.Ret>;
    /** [外部定义]获取Tree节点详情 */
    getById: (id: KeyType) => Promise<Fa.Ret<T>>;
    /** [外部定义]删除Tree节点 */
    remove: (id: KeyType) => Promise<Fa.Ret>;
  };
  onGetTree?: (tree: Fa.TreeNode<T, KeyType>[]) => void; // 每次api拉取tree数据后的回调
  onAfterDelItem?: (item: BaseTreeProps.TreeNode<T, KeyType>) => void;
  rootName?: string;
  renderTreeLabel?: (item: BaseTreeProps.TreeNode<T>) => ReactNode; // 自定义渲染Tree的节点名称
  extraEffectArgs?: any;
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function BaseTree<RecordType extends object = any, KeyType = number>({
  showRoot = false,
  showTopBtn = true,
  showTopAddBtn = true,
  showTips = true,
  showOprBtn = false,
  showOprBtnAdd = true,
  showOprBtnEdit = true,
  serviceName = '',
  className,
  bodyStyle,
  treeStyle,
  ServiceModal = Modal,
  extraContextMenus,
  serviceApi,
  onGetTree,
  onAfterDelItem,
  rootName = Fa.Constant.TREE_SUPER_ROOT_LABEL,
  tips = '右键新增、编辑、删除节点',
  renderTreeLabel,
  extraEffectArgs,
  ...props
}: IProps<RecordType, KeyType>) {
  const { renderCount } = useContext(BaseTreeContext)

  // ------------------------------------------ context menu ------------------------------------------
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function handleContextMenu(event: any, props: BaseTreeProps.TreeNode<RecordType>){
    console.log('handleContextMenu', event, props)
    // 默认根节点无右键菜单
    if (props.value === Fa.Constant.TREE_SUPER_ROOT_ID) return;
    if (!showOprBtn) return;
    show({ event, props })
  }

  // I'm using a single event handler for all items
  // but you don't have too :)
  const handleItemClick = ({ id, event, props }: ItemParams) => {
    const item = props as BaseTreeProps.TreeNode<RecordType, KeyType>;
    switch (id) {
      case "add":
        handleAddItem(item)
        break;
      case "edit":
        handleEditItem(item)
        break;
      case "del":
        confirmDelItem(item)
        break;
    }
  }

  const handleExtraItemClick = (e: ItemParams, extraMenu: BaseTreeProps.ExtraContextMenus) => {
    const item = e.props as BaseTreeProps.TreeNode<RecordType>;
    extraMenu.onMenuClick(e, item)
  }
  // ------------------------------------------ context menu ------------------------------------------

  const [loading, setLoading] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [treeData, setTreeData] = useState<BaseTreeProps.NodeProps[]>([]);
  const [flatDeptList, setFlatDeptList] = useState<BaseTreeProps.FlatTreeNode[]>([]);
  const [clickItem, setClickItem] = useState<BaseTreeProps.TreeNode<RecordType, KeyType> | RecordType>();
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);

  useEffect(() => {
    fetchCourtTree();
  }, [renderCount, extraEffectArgs]);

  function handleAddItem(item?: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    setClickItem(item);
    setEditItemModalVisible(false);
    setAddItemModalVisible(true);
  }

  function handleEditItem(item: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    serviceApi.getById(item.value).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setClickItem(res.data);
        setAddItemModalVisible(false);
        setEditItemModalVisible(true);
      }
    });
  }

  function handleDelItem(item: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    return serviceApi.remove(item.value).then((res) => {
      showResponse(res, `删除${serviceName}`);
      fetchCourtTree();
      if (onAfterDelItem) onAfterDelItem(item);
    });
  }

  function confirmDelItem(item: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    Modal.confirm({
      title: '删除确认',
      content: `确认删除${serviceName}【${item.label}】？`,
      okText: '删除',
      okButtonProps: { type: 'primary', danger: true },
      onOk: () => handleDelItem(item),
      cancelText: '取消',
    });
  }

  function renderTreeData(data: BaseTreeProps.TreeNode<RecordType>[] | undefined): BaseTreeProps.NodeProps[] {
    if (data === undefined) return [];
    return data.map((item) => {
      const { label, value } = item;
      // 标题渲染
      const title = (
        <div className={styles.treeTitleDiv} onContextMenu={(e) => handleContextMenu(e, item)}>
          {renderTreeLabel ? renderTreeLabel(item) : <span>{label}</span>}
          {/*<ContextMenuTrigger id={`context-menu-${value}`} holdToDisplay={-1}>*/}
          {/*  {renderTreeLabel ? renderTreeLabel(item) : <span>{label}</span>}*/}
          {/*</ContextMenuTrigger>*/}
          {/*{showOprBtn && showBtn ? (*/}
          {/*  <ContextMenu id={`context-menu-${value}`}>*/}
          {/*    {showOprBtnAdd && (*/}
          {/*      <MenuItem data={item} onClick={handleAddItem}>*/}
          {/*        <PlusOutlined /> 新增*/}
          {/*      </MenuItem>*/}
          {/*    )}*/}
          {/*    {showOprBtnEdit && (*/}
          {/*      <MenuItem data={item} onClick={handleEditItem}>*/}
          {/*        <EditOutlined /> 编辑*/}
          {/*      </MenuItem>*/}
          {/*    )}*/}
          {/*    {extraContextMenus?.map((ms) => {*/}
          {/*      const { key, title, onMenuClick } = ms;*/}
          {/*      return (*/}
          {/*        <MenuItem key={key} data={item} onClick={onMenuClick}>*/}
          {/*          {title}*/}
          {/*        </MenuItem>*/}
          {/*      );*/}
          {/*    })}*/}
          {/*    <MenuItem data={item} onClick={confirmDelItem}>*/}
          {/*      <span style={{ color: '#ff4d4f' }}>*/}
          {/*        <DeleteOutlined /> 删除*/}
          {/*      </span>*/}
          {/*    </MenuItem>*/}
          {/*  </ContextMenu>*/}
          {/*) : null}*/}
        </div>
      );
      // 子节点渲染
      let children;
      if (item.children && item.children[0]) {
        children = renderTreeData(item.children);
      }
      return {
        key: value,
        title,
        children,
        name: label,
        source: item.sourceData
      };
    });
  }

  function fetchCourtTree() {
    setLoading(true);
    serviceApi.allTree().then((res) => {
        let treeArr = BaseTreeUtils.parseNode<RecordType>(res.data);
        if (showRoot) {
          treeArr = [{ ...{ ...Fa.ROOT_DEFAULT, label: rootName }, children: treeArr }];
        }
        const newTreeData = renderTreeData(treeArr);
        setTreeData(newTreeData);
        // Tree平铺List
        setFlatDeptList(BaseTreeUtils.flatTreeList(newTreeData));
        if (expandedKeys === undefined || expandedKeys.length === 0) {
          if (showRoot) {
            setExpandedKeys([0]);
          }
        }

        if (onGetTree) onGetTree(res.data)
        setLoading(false);
      }).catch(() => setLoading(false));
  }

  function afterEditItem() {
    setClickItem(undefined);
    setAddItemModalVisible(false);
    setEditItemModalVisible(false);
    fetchCourtTree();
  }

  function handleChangePos(list: any[]) {
    serviceApi.changePos(list).then((res) => {
      fetchCourtTree();
    });
  }

  function onDrop(info: any) {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // eslint-disable-next-line consistent-return
    const loop = (dataList: any[], key: any, callback: (data: any, index: number, dataList: any[]) => void) => {
      for (let i = 0; i < dataList.length; i += 1) {
        if (dataList[i].key === key) {
          return callback(dataList[i], i, dataList);
        }
        if (dataList[i].children) {
          loop(dataList[i].children, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj: any;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        // eslint-disable-next-line no-param-reassign
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        // eslint-disable-next-line no-param-reassign
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === 0) {
        // @ts-ignore
        ar.splice(i, 0, dragObj);
      } else {
        // @ts-ignore
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setTreeData(data);

    // 触发更新排序
    const newFlatDeptList = BaseTreeUtils.flatTreeList(data);
    // 筛选出sort、pid变更的节点
    const changeItems: any[] = [];
    each(flatDeptList, (item) => {
      const newItem = find(newFlatDeptList, (n) => n.key === item.key);
      if (newItem === undefined) {
        return;
      }
      if (newItem.index !== item.index || newItem.pid !== item.pid) {
        changeItems.push(newItem);
      }
    });
    // console.log('changeItems', changeItems);
    handleChangePos(changeItems);
  }

  const allKeys = useMemo(() => flatDeptList.map((i) => i.key), [flatDeptList])

  return (
    <div className={className} style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', ...bodyStyle }}>
      {showTopBtn && (
        <div style={{ padding: 12, display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            {showTopAddBtn && (
              <FaHref onClick={() => handleAddItem()} icon={<PlusOutlined />} text={`新增${serviceName}`} />
            )}
          </div>
          <Space>
            <a onClick={() => setExpandedKeys(allKeys)}>展开</a>
            <a onClick={() => setExpandedKeys([])}>收起</a>
          </Space>
        </div>
      )}
      <div className={styles.treeDiv} style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '0 12px', ...treeStyle }}>
          <Spin spinning={loading}>
            <Tree
              blockNode
              showLine={{ showLeafIcon: false }}
              // switcherIcon={<DownOutlined />}
              treeData={treeData}
              draggable={{ icon: false }}
              // onDragEnter={this.onDragEnter}
              onDrop={onDrop}
              // switcherIcon={<Icon type="down" />}
              // defaultExpandParent
              // defaultExpandAll
              // loadData={this.onLoadData}
              expandedKeys={expandedKeys}
              onExpand={(eks) => setExpandedKeys(eks)}
              {...props}
            />
            {/* @ts-ignore */}
            <ServiceModal title={`新增${serviceName}`} parentId={clickItem && get(clickItem, 'value')} open={addItemModalVisible} onCancel={afterEditItem} fetchFinish={afterEditItem}  />
            {/* @ts-ignore */}
            <ServiceModal title={`编辑${serviceName}`} open={editItemModalVisible} record={clickItem} onCancel={afterEditItem} fetchFinish={afterEditItem} destroyOnClose />
          </Spin>
        </div>
      </div>

      <Menu id={MENU_ID} className={styles.contextMenu}>
        {showOprBtnAdd && <Item id="add" onClick={handleItemClick} ><PlusOutlined /> 新增</Item>}
        {showOprBtnEdit && <Item id="edit" onClick={handleItemClick}><EditOutlined /> 编辑</Item>}
        {extraContextMenus?.map((em) => (
          <Item id={em.key} key={em.key} onClick={(e) => handleExtraItemClick(e, em)}>
            {em.icon && em.icon}
            {em.title}
          </Item>
        ))}
        {showOprBtnEdit && <Item id="del" onClick={handleItemClick}>
          <span style={{ color: '#F00' }}><DeleteOutlined /> 删除</span>
        </Item>}
      </Menu>

      {showTips && <div style={{ padding: 12, backgroundColor: '#FFF', color: '#aaa' }}>{tips}</div>}
    </div>
  );
}
