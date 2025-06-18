import React, { useEffect, useState } from 'react';
import { Fa } from '@fa/ui';
import { Disk } from '@/types';
import './DiskLayout.scss';
import { Empty } from 'antd';
import { storeBucketApi } from '@/services';
import { find, isNil, trim } from 'lodash';
import StoreBucketModal from "@features/fa-disk-pages/pages/admin/disk/buckets/modal/StoreBucketModal";
import UploadFilePanel from './cube/UploadFilePanel'
import DiskContext, { DiskContextProps, UploadFileProps } from './context/DiskContext'


let uploadFileArray:UploadFileProps[] = [
  // {
  //   id: '1',
  //   fileName: 'test.png',
  //   total: 10282051,
  //   loaded: 9282051,
  //   progress: 0.9385458212568679,
  //   rate: 126727,
  //   status: 'uploading',
  // },
  // {
  //   id: '2',
  //   fileName: 'test2.png',
  //   total: 10282051,
  //   loaded: 10282051,
  //   progress: 1,
  //   rate: 126727,
  //   status: 'success',
  // }
];

/**
 * 网盘布局文件
 * @author xu.pengfei
 * @date 2022/12/22 10:58
 */
export default function DiskLayout({ children }: Fa.BaseChildProps) {
  const [bucket, setBucket] = useState<Disk.StoreBucket>();
  const [renderCount, setRenderCount] = useState<number>(0);
  const [uploadFiles, setUploadFiles] = useState<UploadFileProps[]>(uploadFileArray)

  function refreshList() {
    storeBucketApi.getMyList().then((res) => {
      if (res.data && res.data[0]) {
        // 获取之前缓存选择库
        const preBucketId = localStorage.getItem('disk:bucket:id');
        if (isNil(preBucketId)) {
          setBucket(res.data[0]);
          return;
        }

        const findBucket = find(res.data, (i) => trim(`${i.id}`) === trim(preBucketId));
        if (findBucket) {
          setBucket(findBucket);
        } else {
          setBucket(res.data[0]);
        }
      }
    });
  }

  useEffect(() => {
    refreshList();
  }, []);

  if (bucket === undefined) {
    return (
      <div className="fa-full-content fa-flex-column-center fa-flex-center">
        <Empty description="未找到库，请新建文件仓库" className="fa-mb12" />
        <StoreBucketModal title="新建文件仓库" addBtn fetchFinish={refreshList} />
      </div>
    );
  }

  const contextValue: DiskContextProps = {
    bucket,
    changeBucket: (bucketId) => {
      localStorage.setItem('disk:bucket:id', bucketId + '');
      storeBucketApi.getById(bucketId).then((res) => setBucket(res.data));
    },
    renderCount,
    addRenderCount: () => setRenderCount((i) => i + 1),
    uploadFiles,
    fireUploadFile: (v) => {
      const findItem = find(uploadFileArray, i => i.id === v.id);
      if (isNil(findItem)) {
        uploadFileArray = [v, ...uploadFileArray]
        setUploadFiles(uploadFileArray)
        return;
      }

      // update progress
      uploadFileArray = uploadFileArray.map(i => {
        return i.id === v.id ? v : i;
      })
      setUploadFiles(uploadFileArray)
    }
  };

  return (
    <DiskContext.Provider value={contextValue}>
      {children}

      <UploadFilePanel />
      {/* TODO 展示正在上传的文件列表 */}
      {/*<div className="fa-disk-info-div">*/}
      {/*  <div className="fa-disk-title-div">*/}
      {/*    <div className="fa-disk-title fa-flex-1">完成上传</div>*/}
      {/*    <div className="fa-disk-title-close">*/}
      {/*      <CloseOutlined />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </DiskContext.Provider>
  );
}
