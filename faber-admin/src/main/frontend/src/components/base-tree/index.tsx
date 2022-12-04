import React, {createContext, CSSProperties, ReactNode, useContext, useEffect, useState} from 'react';
import {each, find, get} from 'lodash';
import {Modal, Space, Spin, Tree} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {RES_CODE} from '@/configs/server.config';
import {showResponse} from '@/utils/utils';
import BaseTreeProps from './interface';
import * as TreeUtils from './utils';
import Fa from '@/props/base/Fa';
import {TreeProps} from 'antd/es/tree';
import {FaHref} from "@/components/decorator";
import styles from './index.module.less';
import {Item, ItemParams, Menu, useContextMenu} from "react-contexify";
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

  const [loading, setLoading] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [treeData, setTreeData] = useState<Fa.TreeNode<RecordType, KeyType>[]>([]);
  const [clickItem, setClickItem] = useState<BaseTreeProps.TreeNode<RecordType, KeyType> | RecordType>();
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);

  useEffect(() => {
    fetchCourtTree();
  }, [renderCount, extraEffectArgs]);

  // ------------------------------------------ context menu ------------------------------------------
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function handleContextMenu(event: any, props: BaseTreeProps.TreeNode<RecordType>){
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

  const handleExtraItemClick = (e: ItemParams, extraMenu: BaseTreeProps.ExtraContextMenus) => {
    const item = e.props as BaseTreeProps.TreeNode<RecordType>;
    extraMenu.onMenuClick(e, item)
  }
  // ------------------------------------------ context menu ------------------------------------------

  function fetchCourtTree() {
    setLoading(true);
    serviceApi.allTree().then((res) => {
        let treeArr = TreeUtils.parseNode<RecordType>(res.data);
        if (showRoot) {
          treeArr = [{ ...Fa.ROOT_DEFAULT, label: rootName, children: treeArr }];
        }
        // const newTreeData = renderTreeData(treeArr);
        setTreeData(treeArr as any[]);
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

  function onDrop(info: any) {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // console.log(info, 'info.dropToGap', info.dropToGap, 'dropKey', dropKey, 'dragKey', dragKey, 'dropPos', dropPos, 'dropPosition', dropPosition)

    // 生成新的排序tree
    const newTree = TreeUtils.dropItem(treeData, dragKey, dropKey, dropPosition, info.dropToGap, info.node.props.expanded);
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
    serviceApi.changePos(changeItems).then((res) => {
      fetchCourtTree();
    });
  }

  function handleExpandAll() {
    const flatTree = TreeUtils.flatTree(treeData)
    setExpandedKeys(flatTree.map((i) => i.key))
  }

  return (
    <div className={className} style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', ...bodyStyle }}>
      {/* top tools */}
      {showTopBtn && (
        <div style={{ padding: 12, display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            {showTopAddBtn && (
              <FaHref onClick={() => handleAddItem()} icon={<PlusOutlined />} text={`新增${serviceName}`} />
            )}
          </div>
          <Space>
            <a onClick={() => handleExpandAll()}>展开</a>
            <a onClick={() => setExpandedKeys([])}>收起</a>
          </Space>
        </div>
      )}

      {/* main tree */}
      <div className={styles.treeDiv} style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '0 12px', ...treeStyle }}>
          <Spin spinning={loading}>
            <Tree
              blockNode
              showLine={{ showLeafIcon: false }}
              treeData={treeData as any[]}
              draggable={{ icon: false }}
              onDrop={onDrop}
              expandedKeys={expandedKeys}
              onExpand={(eks) => setExpandedKeys(eks)}
              fieldNames={{ key: 'id', title: 'name' }}
              titleRender={(item: any) => <div className={styles.treeTitleDiv} onContextMenu={e => handleContextMenu(e, item)}>{item.name}</div>}
              {...props}
            />
            {/* @ts-ignore */}
            <ServiceModal title={`新增${serviceName}`} parentId={clickItem && get(clickItem, 'value')} open={addItemModalVisible} onCancel={afterEditItem} fetchFinish={afterEditItem}  />
            {/* @ts-ignore */}
            <ServiceModal title={`编辑${serviceName}`} open={editItemModalVisible} record={clickItem} onCancel={afterEditItem} fetchFinish={afterEditItem} destroyOnClose />
          </Spin>
        </div>
      </div>

      {/* context menu */}
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
