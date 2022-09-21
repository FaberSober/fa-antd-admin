import React, { createContext, CSSProperties, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { each, find, get } from 'lodash';
import { Button, message, Modal, Space, Spin, Tree } from 'antd';
import { DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { RES_CODE } from '@/configs/server.config';
import { showResponse } from '@/utils/utils';
import BaseTreeProps from './interface';
import * as BaseTreeUtils from './utils';
import Ajax from '@/props/base/Ajax';
import FaberBase from '@/props/base/FaberBase';
import './index.less';
import { TreeProps } from 'antd/es/tree';


export interface BaseTreeContextProps {
  renderCount: number;
  updateRenderCount: () => void;
}

export const BaseTreeContext = createContext<BaseTreeContextProps>({ renderCount: 1, updateRenderCount: () => {} })

const root = { value: 0, label: '根节点', isLeaf: false, hasChildren: true };

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
  ServiceModal?: ReactNode; // 业务新增、编辑弹框
  className?: any;
  bodyStyle?: CSSProperties; // body补充样式
  treeStyle?: CSSProperties; // body补充样式
  extraContextMenus?: BaseTreeProps.ExtraContextMenus[]; // 外部传入的右键菜单
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有Tree节点 */
    allTree: () => Promise<Ajax.Response<FaberBase.TreeNode<T, KeyType>[]>>;
    /** [外部定义]改变Tree节点位置 */
    changePos: (list: any[]) => Promise<Ajax.Response>;
    /** [外部定义]获取Tree节点详情 */
    findOne: (id: KeyType) => Promise<Ajax.Response<T>>;
    /** [外部定义]删除Tree节点 */
    remove: (id: KeyType) => Promise<Ajax.Response>;
  };
  onGetTree?: (tree: FaberBase.TreeNode<T, KeyType>[]) => void;
  onAfterDelItem: (item: BaseTreeProps.TreeNode<T, KeyType>) => void;
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
  rootName = '根节点',
  tips = '右键新增、编辑、删除节点',
  renderTreeLabel,
  extraEffectArgs,
  ...props
}: IProps<RecordType, KeyType>) {
  const { renderCount } = useContext(BaseTreeContext)

  const [loading, setLoading] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [treeData, setTreeData] = useState<BaseTreeProps.NodeProps[]>([]);
  const [flatDeptList, setFlatDeptList] = useState<BaseTreeProps.FlatTreeNode[]>([]);
  const [clickItem, setClickItem] = useState<BaseTreeProps.TreeNode | RecordType>();
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);

  useEffect(() => {
    fetchCourtTree();
  }, [renderCount, extraEffectArgs]);

  function handleAddItem(e: any, item?: BaseTreeProps.TreeNode) {
    if (e) e.stopPropagation();
    setClickItem(item);
    setEditItemModalVisible(false);
    setAddItemModalVisible(true);
  }

  function handleEditItem(e: any, item: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    if (e) e.stopPropagation();
    serviceApi.findOne(item.value).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setClickItem(res.data);
        setAddItemModalVisible(false);
        setEditItemModalVisible(true);
      }
    });
  }

  function handleDelItem(item: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    serviceApi.remove(item.value).then((res) => {
      showResponse(res, `删除${serviceName}`);
      if (res && res.status === RES_CODE.OK) {
        fetchCourtTree();
        if (onAfterDelItem) onAfterDelItem(item);
      }
    });
  }

  function confirmDelItem(e: any, item: BaseTreeProps.TreeNode<RecordType, KeyType>) {
    if (e) e.stopPropagation();
    if (`${item.value}` === '0') {
      message.error(`该${serviceName}为默认${serviceName}，不可删除`);
      return;
    }
    Modal.confirm({
      title: '删除确认',
      content: `确认删除${serviceName}【${item.label}】？`,
      okText: '删除',
      okButtonProps: { type: 'primary', danger: true },
      onOk: () => {
        handleDelItem(item);
      },
      cancelText: '取消',
    });
  }

  function renderTreeData(data: BaseTreeProps.TreeNode<RecordType>[] | undefined): BaseTreeProps.NodeProps[] {
    if (data === undefined) return [];
    return data.map((item) => {
      const { label, value } = item;
      const showBtn = value !== 0;
      // 标题渲染
      const title = (
        <div className="treeTitleDiv">
          <ContextMenuTrigger id={`context-menu-${value}`} holdToDisplay={-1}>
            {renderTreeLabel ? renderTreeLabel(item) : <span>{label}</span>}
          </ContextMenuTrigger>
          {showOprBtn && showBtn ? (
            <ContextMenu id={`context-menu-${value}`}>
              {showOprBtnAdd && (
                <MenuItem data={item} onClick={handleAddItem}>
                  <PlusOutlined /> 新增
                </MenuItem>
              )}
              {showOprBtnEdit && (
                <MenuItem data={item} onClick={handleEditItem}>
                  <EditOutlined /> 编辑
                </MenuItem>
              )}
              {extraContextMenus?.map((ms) => {
                const { key, menuTitle, onMenuClick } = ms;
                return (
                  <MenuItem key={key} data={item} onClick={onMenuClick}>
                    {menuTitle}
                  </MenuItem>
                );
              })}
              <MenuItem data={item} onClick={confirmDelItem}>
                <span style={{ color: '#ff4d4f' }}>
                  <DeleteOutlined /> 删除
                </span>
              </MenuItem>
            </ContextMenu>
          ) : null}
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
        if (res && res.status === RES_CODE.OK) {
          let treeArr = BaseTreeUtils.parseNode<RecordType>(res.data);
          if (showRoot) {
            treeArr = [{ ...{ ...root, label: rootName }, children: treeArr }];
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

          if (onGetTree) {
            onGetTree(res.data)
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
              <Button onClick={handleAddItem} icon={<PlusOutlined />}>
                新增{serviceName}
              </Button>
            )}
          </div>
          <Space>
            <a onClick={() => setExpandedKeys(allKeys)}>展开</a>
            <a onClick={() => setExpandedKeys([])}>收起</a>
          </Space>
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '0 12px', ...treeStyle }}>
          <Spin spinning={loading}>
            <Tree
              blockNode
              showLine={{ showLeafIcon: false }}
              switcherIcon={<DownOutlined />}
              treeData={treeData}
              draggable
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
      {showTips && <div style={{ padding: 12, backgroundColor: '#FFF', color: '#aaa' }}>{tips}</div>}
    </div>
  );
}
