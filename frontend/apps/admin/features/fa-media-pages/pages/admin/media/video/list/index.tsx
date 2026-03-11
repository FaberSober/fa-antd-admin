import React from 'react';
import { DownloadOutlined, EyeOutlined, RocketOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input, Popconfirm, Space, Tooltip } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseDrawer, BaseTableUtils, clearForm, FaberTable, FaHref, FaUtils, fileSaveApi, useDelete, useDeleteByQuery, useExport, useTableQueryParams } from '@fa/ui';
import { mediaVideoApi as api } from '@/services';
import { Media } from '@/types';
import MediaVideoModal from './modal/MediaVideoModal';
import MediaVideoView from './cube/MediaVideoView';
import { VideoPlainModal } from '@/components';
import useBus from 'use-bus';

const serviceName = '媒体-视频信息表';
const biz = 'media_video';

/**
 * 媒体-视频信息表表格查询
 */
export default function MediaVideoList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, setList, paginationProps } =
          useTableQueryParams<Media.MediaVideo>(api.minePage, {}, serviceName)

  const [handleDelete] = useDelete<string>(api.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams)
  const [_, deleteByQuery] = useDeleteByQuery(api.removeByQuery, queryParams, fetchPageList);

  useBus(
    ['@@ws/RECEIVE/MEDIA_COMPRESS_VIDEO'],
    ({ type, channel, payload }) => {
        console.log(type, channel, payload);
        const newList = list.map(i => {
          if (i.id === payload.id) {
            return { ...i, trans720pProgress: payload.trans720pProgress, trans720pStatus: payload.trans720pStatus, trans720pFileId: payload.trans720pFileId }
          }
          return i;
        })
        setList(newList)
    },
    [setList],
  )

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIndexColumn(paginationProps),
      BaseTableUtils.genIdColumn('视频记录唯一ID', 'id', 70, sorter, false),
      // BaseTableUtils.genSimpleSorterColumn('关联业务ID（如文章ID、动态ID、课程ID等）', 'businessId', 100, sorter),
      // BaseTableUtils.genSimpleSorterColumn('业务类型（如 post、moment、course 等）', 'businessType', 100, sorter),
      // BaseTableUtils.genSimpleSorterColumn('原视频', 'originFileId', 100, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('封面', 'coverFileId', 100, sorter),
        render: (_, r) => {
          if(!r.coverFileId) {
            return '-';
          }
          return (
            <Image
              src={fileSaveApi.genLocalGetFile(r.coverFileId)}
              alt={r.originFilename}
              style={{ width: 80, height: 'auto', borderRadius: 4, objectFit: 'cover' }}
            />
          )
        }
      },
      {
        ...BaseTableUtils.genSimpleSorterColumn('文件名', 'originFilename', 200, sorter),
        render: (_, r) => {
          return (
            <VideoPlainModal url={fileSaveApi.genLocalGetFile(r.originFileId)}>
              <a>{r.originFilename}</a>
            </VideoPlainModal>
          );
        }
      },
      BaseTableUtils.genSimpleSorterColumn('宽度', 'originWidth', 80, sorter),
      BaseTableUtils.genSimpleSorterColumn('高度', 'originHeight', 80, sorter),
      BaseTableUtils.genSimpleSorterColumn('码率', 'originBitrate', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('时长', 'originDuration', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('原大小', 'originSizeMb', 100, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('720p文件', 'trans720pFileId', 100, sorter),
        render: (_, r) => {
          if (r.trans720pStatus === 0) {
            return '未开始';
          } else if (r.trans720pStatus === 1) {
            return `转码中(${r.trans720pProgress}%)`;
          } else if (r.trans720pStatus === 3) {
            return (
              <Tooltip title={r.trans720pMessage}>
                <span style={{ color: 'red', cursor: 'pointer' }}>失败</span>
              </Tooltip>
            );
          } else if (r.trans720pStatus === 4) {
            return '已取消';
          }
          if(!r.trans720pFileId) {
            return '-';
          }
          return (
            <VideoPlainModal url={fileSaveApi.genLocalGetFile(r.trans720pFileId)}>
              <a>查看</a>
            </VideoPlainModal>
          )
        }
      },
      BaseTableUtils.genSimpleSorterColumn('720p大小', 'trans720pSizeMb', 100, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('预览视频', 'previewFileId', 100, sorter),
        render: (_, r) => {
          if(!r.previewFileId) {
            return '-';
          }
          return (
            <VideoPlainModal url={fileSaveApi.genLocalGetFile(r.previewFileId)}>
              <a>查看</a>
            </VideoPlainModal>
          )
        }
      },
      // BaseTableUtils.genSimpleSorterColumn('预览视频时长', 'previewDuration', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('视频格式', 'format', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('视频编码', 'codecVideo', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('音频编码', 'codecAudio', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('帧率', 'fps', 100, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('状态', 'status', 100, sorter),
        render: (_, r) => {
          let text = '';
          switch (r.status) {
            case 0: text = '转码中'; break;
            case 1: text = '正常'; break;
            case -1: text = '转码失败'; break;
            case -2: text = '违规'; break;
            default: text = r.status + '';
          }
          return text;
        },
      },
      // BaseTableUtils.genSimpleSorterColumn('审核状态：0=待审核,1=通过,2=拒绝', 'auditStatus', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <BaseDrawer triggerDom={<FaHref text="查看" icon={<EyeOutlined />} />}>
              <MediaVideoView item={r} />
            </BaseDrawer>
            <Popconfirm title="确定要压缩该视频吗？" onConfirm={() => {
              api.startCompressVideo(r.id).then((res) => {
                FaUtils.showResponse(res, '启动视频压缩');
                fetchPageList();
              })
            }}>
              <a className='fa-link-btn'><RocketOutlined />压缩</a>
            </Popconfirm>
            {/* <MediaVideoModal editBtn title={`编辑${serviceName}信息`} record={r} fetchFinish={fetchPageList} /> */}
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 170,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Media.MediaVideo>[];
  }

  return (
    <div className="fa-full-content-p12 fa-flex-column fa-content">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="originFilename" label="文件名">
              <Input placeholder="请输入文件名" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>查询</Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <MediaVideoModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
            </Space>
          </Form>
        </div>
      </div>

      <BaseBizTable
        rowKey="id"
        biz={biz}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => api.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        showDeleteByQuery
        onDeleteByQuery={deleteByQuery}
      />
    </div>
  );
}
