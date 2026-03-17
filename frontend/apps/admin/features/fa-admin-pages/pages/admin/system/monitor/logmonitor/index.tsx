import React, { useEffect, useRef, useState } from 'react';
import { Card, Tree, Empty, Spin, Button, Space } from 'antd';
import useBus from 'use-bus';
import { logMonitorApi } from '@/services';
import { Fa } from '@fa/ui';
import { sendMessage } from '@features/fa-admin-pages/layout/websocket';
import './index.scss'

/**
 * Log monitor page
 * @author xu.pengfei
 * @date 2024/11/27 17:39
 */
export default function LogMonitor() {
  const [treeData, setTreeData] = useState<Fa.TreeNode<any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isTail, setIsTail] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef<number>(0);

  useEffect(() => {
    fetchTree();
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const toBottom = () => {
    const timer = setTimeout(scrollToBottom, 50);
  }

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    // Detect if scrolling up
    if (scrollTop < lastScrollTopRef.current) {
      setIsTail(false);
    }

    // Detect if scrolled to bottom (with some buffer)
    if (scrollHeight - scrollTop - clientHeight < 10) {
      setIsTail(true);
    }

    lastScrollTopRef.current = scrollTop;
  };

  // WebSocket message handler
  useBus(
    ['@@ws/RECEIVE/log-tail'],
    ({ channel, payload }: any) => {
      if (channel === selectedFile) {
        setLogs((prev) => [...prev, payload]);
        if (isTail) {
          toBottom();
        }
      }
    },
    [selectedFile, isTail]
  );

  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await logMonitorApi.listLogFiles();
      setTreeData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (keys: any, info: any) => {
    if (keys.length > 0) {
      const node = info.node;
      // If it has children and children is not empty, it's a directory
      if (node.children && node.children.length > 0) {
        return;
      }
      
      const filePath = keys[0];
      
      // Stop previous tail
      if (selectedFile) {
        sendMessage({ type: 'log-tail', data: { action: 'stop' } });
      }

      setSelectedFile(filePath);
      setIsTail(true);
      setLoading(true);
      try {
        const res = await logMonitorApi.readLogFile(filePath, 200);
        setLogs(res.data);
        toBottom()
        
        // Start new tail
        sendMessage({ type: 'log-tail', data: { action: 'start', filePath } });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (selectedFile) {
      logMonitorApi.download(selectedFile);
    }
  };

  const handleViewAll = async () => {
    if (selectedFile) {
      setIsTail(true);
      setLoading(true);
      try {
        // Read 10,000 lines as "all" for safety, or increase as needed
        const res = await logMonitorApi.readLogFile(selectedFile, 10000);
        setLogs(res.data);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fa-full-content-p12 fa-flex-row fa-gap12">
      {/* 左侧展示目录文件树 */}
      <Card className="fa-content" style={{ width: 350 }} title="日志文件" styles={{ body: { padding: 12, overflow: 'auto' } }}>
        <Spin spinning={loading}>
          {treeData.length > 0 ? (
            <Tree
              treeData={treeData}
              fieldNames={{ title: 'name', key: 'id', children: 'children' }}
              onSelect={handleSelect}
              defaultExpandAll
              titleRender={(node: any) => (
                <Space>
                  <span>{node.name}</span>
                  {!node.children && node.sourceData?.sizeStr && (
                    <span style={{ color: '#999', fontSize: 12 }}>({node.sourceData.sizeStr})</span>
                  )}
                </Space>
              )}
            />
          ) : (
            <Empty />
          )}
        </Spin>
      </Card>

      {/* 右侧展示选中的日志文件 */}
      <Card
        className="fa-content fa-flex-1 fa-flex-column"
        title={selectedFile || '请选择日志文件'}
        extra={
          <Space>
            <Button size="small" disabled={!selectedFile} onClick={handleViewAll}>查看全部</Button>
            <Button size="small" disabled={!selectedFile} onClick={handleDownload}>下载</Button>
            <Button size="small" type={isTail ? 'primary' : 'default'} onClick={() => setIsTail(!isTail)}>
              {isTail ? '自动出屏: 开' : '自动出屏: 关'}
            </Button>
            <Button size="small" onClick={() => setLogs([])}>清屏</Button>
          </Space>
        }
        styles={{
          body: { padding: 0, position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }
        }}
      >
        <div
          ref={scrollRef}
          className="fa-log-monitor-container fa-full-content"
          onScroll={handleScroll}
        >
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="fa-log-line fa-break-word">
                {log}
              </div>
            ))
          ) : (
            <div className="fa-log-empty">暂无日志信息...</div>
          )}
        </div>
      </Card>
    </div>
  );
}
