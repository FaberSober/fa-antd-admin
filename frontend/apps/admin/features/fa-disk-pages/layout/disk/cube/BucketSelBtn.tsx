import React, { useContext, useState } from 'react';
import { Button, Popover } from 'antd';
import { DiskContext } from '@/layout';
import { Disk } from '@/types';
import { storeBucketApi } from '@/services';

export interface BucketSelBtnProps {}

/**
 * @author xu.pengfei
 * @date 2022/12/22 15:22
 */
export default function BucketSelBtn(_: BucketSelBtnProps) {
  const { bucket, changeBucket } = useContext(DiskContext);

  const [open, setOpen] = useState(false);
  const [array, setArray] = useState<Disk.StoreBucket[]>([]);

  function refreshList() {
    storeBucketApi.getMyList().then((res) => setArray(res.data));
  }

  return (
    <div style={{ padding: 4 }}>
      <Popover
        placement="bottomLeft"
        onOpenChange={(v) => {
          setOpen(v);
          if (v) refreshList();
        }}
        open={open}
        overlayInnerStyle={{ padding: 0 }}
        content={
          <div>
            {array.map((i) => (
              <div
                key={i.id}
                className="fa-disk-bucket-item"
                onClick={() => {
                  changeBucket(i.id);
                  setOpen(false);
                }}
              >
                {i.name}
              </div>
            ))}

            {/*<StoreBucketModal*/}
            {/*  title="新增库"*/}
            {/*  fetchFinish={() => {*/}
            {/*    refreshList();*/}
            {/*    setOpen(true);*/}
            {/*  }}*/}
            {/*  getContainer={document.body}*/}
            {/*  onOpen={() => setOpen(false)}*/}
            {/*>*/}
            {/*  <div className="fa-disk-bucket-item">*/}
            {/*    <PlusOutlined className="fa-mr8" />*/}
            {/*    新增库*/}
            {/*  </div>*/}
            {/*</StoreBucketModal>*/}
          </div>
        }
        trigger="click"
      >
        <Button block type="primary">
          {bucket.name}
        </Button>
      </Popover>
    </div>
  );
}
