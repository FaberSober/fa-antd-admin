import React, { useEffect, useRef, useState } from 'react';
import { BaseHtmlNEditor } from '@/components/base-editor';
import { Button, Empty } from 'antd';
import outlineService from '@/services/article/outline';
import detailService from '@/services/article/detail';
import { RES_CODE } from '@/configs/server.config';
import Article from '@/props/article';
import { SaveOutlined } from '@ant-design/icons';
import { showResponse } from '@/utils/utils';

interface IProps {
  outlineId?: number;
}

/**
 * @author xu.pengfei
 * @date 2020/12/31
 */
export default function OutlineDetailEdit({ outlineId }: IProps) {
  const editorRef = useRef<any | null>();

  const [outlineDetail, setOutlineDetail] = useState<Article.OutlineDetailVo>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (outlineId === undefined) return;

    setLoading(true);
    outlineService.findDetail(outlineId).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setOutlineDetail(res.data);
      }
      setLoading(false);
    });
  }, [outlineId]);

  function handleSaveDetail() {
    if (outlineDetail === undefined) return;
    setSaving(true);
    const params = { ...outlineDetail.detail, detail: editorRef.current.getContent() };
    detailService.update(outlineDetail.detail.id, params).then((res) => {
      showResponse(res, '保存文章');
      setSaving(false);
    });
  }

  if (outlineDetail === undefined) return <Empty description="选择右侧文章进行编辑" />;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ height: 44 }}>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSaveDetail}>
          保存
        </Button>
      </div>
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, overflow: 'auto' }}>
        <BaseHtmlNEditor ref={editorRef} value={outlineDetail?.detail.detail} loading={loading} />
      </div>
    </div>
  );
}
