import type { Admin } from '@/types';
import {
  DeleteOutlined,
  DownOutlined,
  ReloadOutlined,
  SearchOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { FaUtils } from '@fa/ui';
import { redisApi } from '@features/fa-admin-pages/services';
import { Button, Card, Descriptions, Empty, Input, Modal, Space, Splitter, Table, Tag, Tree, message } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';
import './index.scss';

type RedisTreeNode = DataNode & {
  redisKey?: string;
  keyCount?: number;
};

const TYPE_COLORS: Record<string, string> = {
  string: 'blue',
  hash: 'purple',
  list: 'cyan',
  set: 'gold',
  zset: 'geekblue',
};

function formatTtl(ttlSeconds?: number, persistent?: boolean) {
  if (persistent || ttlSeconds === undefined) {
    return '永久';
  }
  if (ttlSeconds < 60) {
    return `${ttlSeconds}s`;
  }
  if (ttlSeconds < 3600) {
    return `${Math.floor(ttlSeconds / 60)}m ${ttlSeconds % 60}s`;
  }
  return `${Math.floor(ttlSeconds / 3600)}h ${Math.floor((ttlSeconds % 3600) / 60)}m`;
}

function buildTreeData(items: Admin.RedisKeyItem[]): RedisTreeNode[] {
  const root: RedisTreeNode[] = [];
  const groupMap = new Map<string, RedisTreeNode>();

  function createGroup(path: string, title: string, parent?: RedisTreeNode) {
    const node: RedisTreeNode = {
      key: `group:${path}`,
      title,
      children: [],
      selectable: false,
      disableCheckbox: true,
      keyCount: 0,
    };
    groupMap.set(path, node);
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(node);
    } else {
      root.push(node);
    }
    return node;
  }

  for (const item of items) {
    const segments = item.key.split(':').filter(Boolean);
    let path = '';
    let parent: RedisTreeNode | undefined;

    for (let i = 0; i < Math.max(segments.length - 1, 0); i++) {
      path = path ? `${path}:${segments[i]}` : segments[i];
      const exists = groupMap.get(path);
      parent = exists || createGroup(path, segments[i], parent);
      parent.keyCount = (parent.keyCount || 0) + 1;
    }

    const leafTitle = segments.length > 0 ? segments[segments.length - 1] : item.key;
    const leafNode: RedisTreeNode = {
      key: item.key,
      title: leafTitle,
      isLeaf: true,
      redisKey: item.key,
    };

    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(leafNode);
    } else {
      root.push(leafNode);
    }
  }

  function sortNodes(nodes: RedisTreeNode[]) {
    nodes.sort((a, b) => {
      const aLeaf = !!a.redisKey;
      const bLeaf = !!b.redisKey;
      if (aLeaf !== bLeaf) {
        return aLeaf ? 1 : -1;
      }
      return String(a.title).localeCompare(String(b.title), 'zh-CN');
    });
    nodes.forEach((node) => node.children && sortNodes(node.children as RedisTreeNode[]));
  }

  sortNodes(root);
  return root;
}

/**
 * Redis本地管理页
 * @author xu.pengfei
 * @date 2022/11/29
 */
export default function Redis() {
  const [overview, setOverview] = useState<Admin.RedisOverview>();
  const [keyword, setKeyword] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keyList, setKeyList] = useState<Admin.RedisKeyItem[]>([]);
  const [treeData, setTreeData] = useState<RedisTreeNode[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>();
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [detail, setDetail] = useState<Admin.RedisKeyDetail>();
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    fetchOverview();
    fetchKeys('');
  }, []);

  async function fetchOverview() {
    const res = await redisApi.overview();
    setOverview(res.data);
  }

  async function fetchKeys(nextKeyword = keyword) {
    setLoadingList(true);
    try {
      const res = await redisApi.listKeys(nextKeyword, 300);
      const items = res.data.items || [];
      const nextTreeData = buildTreeData(items);
      setKeyList(items);
      setTreeData(nextTreeData);
      setTruncated(!!res.data.truncated);
      setCheckedKeys([]);
      setExpandedKeys((prev) => {
        if (nextKeyword) {
          return collectGroupKeys(nextTreeData);
        }
        if (prev.length === 0) {
          return nextTreeData
            .filter((node) => !node.redisKey)
            .map((node) => node.key as React.Key);
        }
        return prev.filter((key) => keyExists(nextTreeData, key));
      });

      const exists = items.some((item) => item.key === selectedKey);
      if (!exists) {
        setSelectedKey(undefined);
        setDetail(undefined);
      }
    } finally {
      setLoadingList(false);
    }
  }

  async function fetchDetail(key: string) {
    setLoadingDetail(true);
    try {
      const res = await redisApi.detail(key);
      setDetail(res.data);
    } catch (e: any) {
      setDetail(undefined);
      message.error(e?.message || '读取详情失败');
    } finally {
      setLoadingDetail(false);
    }
  }

  function handleSearch() {
    const nextKeyword = keywordInput.trim();
    setKeyword(nextKeyword);
    fetchKeys(nextKeyword);
  }

  function handleSelect(keys: React.Key[]) {
    const key = String(keys[0] || '');
    if (!key || key.startsWith('group:')) {
      return;
    }
    setSelectedKey(key);
    fetchDetail(key);
  }

  function handleCheck(keys: any) {
    const nextKeys = (Array.isArray(keys) ? keys : keys.checked).filter((item: string) =>
      keyList.some((key) => key.key === item),
    );
    setCheckedKeys(nextKeys);
  }

  function handleExpandAll() {
    setExpandedKeys(collectGroupKeys(treeData));
  }

  function handleCollapseAll() {
    setExpandedKeys([]);
  }

  async function deleteOne(key: string) {
    setDeleting(true);
    try {
      await redisApi.deleteKey(key);
      message.success('删除成功');
      if (selectedKey === key) {
        setSelectedKey(undefined);
        setDetail(undefined);
      }
      await Promise.all([fetchOverview(), fetchKeys()]);
    } finally {
      setDeleting(false);
    }
  }

  function confirmDeleteOne(key: string) {
    Modal.confirm({
      title: '确认删除当前 Key？',
      content: key,
      okButtonProps: { danger: true },
      onOk: () => deleteOne(key),
    });
  }

  function confirmDeleteBatch() {
    Modal.confirm({
      title: `确认批量删除 ${checkedKeys.length} 个 Key？`,
      content: '该操作不可恢复，请确认当前筛选结果和选中项。',
      okButtonProps: { danger: true },
      onOk: async () => {
        setDeleting(true);
        try {
          await redisApi.batchDelete(checkedKeys);
          message.success('批量删除成功');
          setSelectedKey(undefined);
          setDetail(undefined);
          await Promise.all([fetchOverview(), fetchKeys()]);
        } finally {
          setDeleting(false);
        }
      },
    });
  }

  const currentItem = keyList.find((item) => item.key === selectedKey);
  const typeStats: Record<string, number> = {};
  for (const item of keyList) {
    typeStats[item.type] = (typeStats[item.type] || 0) + 1;
  }

  const entryColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 90,
      render: (value: number | undefined) => (value === undefined ? '--' : value),
    },
    {
      title: detail?.type === 'hash' ? '字段' : '值',
      dataIndex: detail?.type === 'hash' ? 'field' : 'value',
      render: (value: string) => (
        <div className="redis-monitor-cell" title={value}>
          {value || '--'}
        </div>
      ),
    },
    ...(detail?.type === 'hash'
      ? [
          {
            title: '内容',
            dataIndex: 'value',
            render: (value: string) => (
              <div className="redis-monitor-cell" title={value}>
                {value || '--'}
              </div>
            ),
          },
        ]
      : []),
    ...(detail?.type === 'zset'
      ? [
          {
            title: 'Score',
            dataIndex: 'score',
            width: 120,
          },
        ]
      : []),
  ];

  const persistentCount = keyList.filter((item) => item.persistent).length;

  return (
    <div className="fa-full-content-p12 redis-monitor-page">
      <div className="redis-monitor-toolbar">
        <div>
          <div className="redis-monitor-title">Redis 管理</div>
        </div>
        <Space wrap>
          <div className="redis-monitor-search-bar redis-monitor-search-bar-top">
            <Input
              allowClear
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onPressEnter={handleSearch}
              placeholder="输入 key 关键字或 * 通配符"
              prefix={<SearchOutlined />}
              className="redis-monitor-search-input"
            />
            <Button type="primary" onClick={handleSearch} className="redis-monitor-search-btn">
              搜索
            </Button>
          </div>
          <Button
            icon={<ReloadOutlined />}
            loading={loadingList}
            onClick={() => {
              fetchOverview();
              fetchKeys();
            }}
          >
            刷新
          </Button>
          <Button danger icon={<DeleteOutlined />} disabled={!checkedKeys.length} loading={deleting} onClick={confirmDeleteBatch}>
            删除选中
          </Button>
          <Tag color="blue">前缀 {overview?.redisPrefix || '--'}</Tag>
          <Tag color="geekblue">总 Key {overview?.dbSize || 0}</Tag>
          <Tag color="gold">命中 {keyList.length}{truncated ? '+' : ''}</Tag>
          <Tag color="green">永久 {persistentCount}</Tag>
        </Space>
      </div>

      <Splitter className="redis-monitor-splitter">
        <Splitter.Panel defaultSize={420} min={340} max="45%">
          <Card
            className="redis-monitor-card redis-monitor-list-card"
            title={`Key 列表${keyword ? ` · ${keyword}` : ''}`}
            extra={
              <Space direction="vertical" size={10} className="redis-monitor-list-actions">
                <Space size={[6, 6]} wrap className="redis-monitor-search-tags">
                  {!!treeData.length && (
                    <>
                      <Button size="small" icon={<DownOutlined />} onClick={handleExpandAll}>
                        展开全部
                      </Button>
                      <Button size="small" icon={<UpOutlined />} onClick={handleCollapseAll}>
                        收起
                      </Button>
                    </>
                  )}
                  {truncated && <Tag color="gold">结果已截断</Tag>}
                  {Object.keys(typeStats).length ? (
                    Object.entries(typeStats).map(([type, count]) => (
                      <Tag key={type} color={TYPE_COLORS[type] || 'default'}>
                        {type} {count}
                      </Tag>
                    ))
                  ) : (
                    <span className="redis-monitor-muted">暂无数据</span>
                  )}
                </Space>
              </Space>
            }
            style={{ marginRight: 6 }}
            styles={{ body: { padding: 8, height: 'calc(100% - 96px)', overflow: 'auto' } }}
            loading={loadingList}
          >
            {treeData.length ? (
              <Tree
                blockNode
                checkable
                checkStrictly
                expandedKeys={expandedKeys}
                autoExpandParent={false}
                selectedKeys={selectedKey ? [selectedKey] : []}
                checkedKeys={checkedKeys}
                treeData={treeData}
                onExpand={(keys) => setExpandedKeys(keys)}
                onSelect={handleSelect}
                onCheck={handleCheck}
                titleRender={(node: any) => {
                  if (!node.redisKey) {
                    return (
                      <Space size={8}>
                        <span>{node.title}</span>
                        <span className="redis-monitor-group-count">{node.keyCount || 0}</span>
                      </Space>
                    );
                  }
                  const item = keyList.find((it) => it.key === node.redisKey);
                  if (!item) {
                    return node.title;
                  }
                  return (
                    <div className="redis-monitor-tree-leaf">
                      <div className="redis-monitor-tree-main">
                        <span className="redis-monitor-tree-key">{node.title}</span>
                        <Tag bordered={false} color={TYPE_COLORS[item.type] || 'default'}>
                          {item.type}
                        </Tag>
                      </div>
                      <div className="redis-monitor-tree-sub">
                        <span className="redis-monitor-tree-ttl">{formatTtl(item.ttlSeconds, item.persistent)}</span>
                        <span className="redis-monitor-tree-summary">{item.summary || `${item.size} 项`}</span>
                      </div>
                    </div>
                  );
                }}
              />
            ) : (
              <Empty description="未找到匹配的 Redis Key" />
            )}
          </Card>
        </Splitter.Panel>

        <Splitter.Panel>
          <div className="redis-monitor-detail">
            <Card
              className="redis-monitor-card redis-monitor-detail-card"
              title={selectedKey || '请选择左侧 Key'}
              extra={
                selectedKey ? (
                  <Space>
                    <Button size="small" onClick={() => fetchDetail(selectedKey)} loading={loadingDetail}>
                      刷新详情
                    </Button>
                    <Button size="small" danger onClick={() => confirmDeleteOne(selectedKey)} loading={deleting}>
                      删除当前 Key
                    </Button>
                  </Space>
                ) : undefined
              }
              styles={{ body: { display: 'flex', flexDirection: 'column', gap: 12 } }}
              loading={loadingDetail}
            >
              {detail ? (
                <>
                  <Descriptions bordered size="small" column={2}>
                    <Descriptions.Item label="Key" span={2}>
                      <div className="redis-monitor-key-full">{detail.key}</div>
                    </Descriptions.Item>
                    <Descriptions.Item label="类型">
                      <Tag color={TYPE_COLORS[detail.type] || 'default'}>{detail.type}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="TTL">{formatTtl(detail.ttlSeconds, detail.persistent)}</Descriptions.Item>
                    <Descriptions.Item label="长度 / 项数">{detail.size ?? 0}</Descriptions.Item>
                    <Descriptions.Item label="筛选关键字">{keyword || '--'}</Descriptions.Item>
                  </Descriptions>

                  {detail.type === 'string' ? (
                    <Card title="Value" size="small" className="redis-monitor-inner-card">
                      <pre className="redis-monitor-pre">{FaUtils.tryFormatJson(detail.valueText || '')}</pre>
                    </Card>
                  ) : (
                    <Card
                      title={`数据项 ${detail.entries?.length || 0}`}
                      size="small"
                      className="redis-monitor-inner-card"
                      styles={{ body: { padding: 0 } }}
                    >
                      <Table
                        rowKey={(record) => `${record.field || ''}-${record.index || 0}-${record.score || ''}`}
                        columns={entryColumns}
                        dataSource={detail.entries || []}
                        size="small"
                        pagination={{ pageSize: 20, showSizeChanger: false }}
                      />
                    </Card>
                  )}

                  {currentItem?.summary ? (
                    <Card title="预览摘要" size="small" className="redis-monitor-inner-card">
                      <div className="redis-monitor-preview">{currentItem.summary}</div>
                    </Card>
                  ) : null}
                </>
              ) : (
                <Empty description="选择左侧 Key 后查看详情" className="redis-monitor-empty" />
              )}
            </Card>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}

function collectGroupKeys(nodes: RedisTreeNode[]): React.Key[] {
  const keys: React.Key[] = [];

  function walk(list: RedisTreeNode[]) {
    for (const node of list) {
      if (!node.redisKey) {
        keys.push(node.key as React.Key);
      }
      if (node.children?.length) {
        walk(node.children as RedisTreeNode[]);
      }
    }
  }

  walk(nodes);
  return keys;
}

function keyExists(nodes: RedisTreeNode[], target: React.Key): boolean {
  for (const node of nodes) {
    if (node.key === target) {
      return true;
    }
    if (node.children?.length && keyExists(node.children as RedisTreeNode[], target)) {
      return true;
    }
  }
  return false;
}
