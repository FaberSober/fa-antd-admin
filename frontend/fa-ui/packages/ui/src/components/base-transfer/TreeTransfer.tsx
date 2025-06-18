import React, { Key, useEffect, useState } from 'react';
import { Transfer, Tree } from 'antd';
import { TransferDirection, TransferItem, TransferProps } from 'antd/es/transfer';
import type { DataNode } from 'antd/es/tree';
import { Fa } from "@ui/types";
import * as TreeUtils from "@ui/components/base-tree/utils";

export interface TreeTransferProps extends Omit<TransferProps<any>, 'onChange'> {
  targetKeys: string[];
  onChange: (targetKeys: Key[], direction: TransferDirection, moveKeys: Key[]) => void;
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有Tree节点 */
    allTree: () => Promise<Fa.Ret<Fa.TreeNode<any, any>[]>>;
  };
  extraEffectArgs?: any[];
}

// Customize Table Transfer
const isChecked = (selectedKeys: (string | number)[], eventKey: string | number) =>
  selectedKeys.includes(eventKey);


const generateTree = (treeNodes: DataNode[] = [], checkedKeys: string[] = []): DataNode[] =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key as string),
    children: generateTree(children, checkedKeys),
  }));

export default function TreeTransfer({ targetKeys, serviceApi, extraEffectArgs = [], ...restProps }: TreeTransferProps) {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  useEffect(() => {
    fetchCourtTree();
  }, [...extraEffectArgs]);

  function fetchCourtTree() {
    setLoading(true);
    serviceApi
      .allTree()
      .then((res) => {
        const treeArr = TreeUtils.parseAntdNode(res.data) || [];
        setTreeData(treeArr as any[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }


  const transferDataSource: TransferItem[] = [];
  function flatten(list: DataNode[] = []) {
    list.forEach((item) => {
      transferDataSource.push(item as TransferItem);
      flatten(item.children);
    });
  }
  flatten(treeData);

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={(item) => item.title!}
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys: any[] = [...selectedKeys, ...targetKeys];
          return (
            <div >
              <Tree
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                treeData={generateTree(treeData, targetKeys)}
                onCheck={(_, { node: { key } }) => {
                  onItemSelect(key as string, !isChecked(checkedKeys, key as string));
                }}
                onSelect={(_, { node: { key } }) => {
                  onItemSelect(key as string, !isChecked(checkedKeys, key as string));
                }}
              />
            </div>
          );
        }
        return undefined;
      }}
    </Transfer>
  );
};
