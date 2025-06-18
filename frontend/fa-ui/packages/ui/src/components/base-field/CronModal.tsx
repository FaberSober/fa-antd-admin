import React, { useEffect, useState } from 'react';
import { DragModal, DragModalProps } from '@ui/components/base-modal';
import { trim } from 'lodash';
import { CronEditor } from 'fa-cron-react-editor';
import {jobApi} from '@ui/services/base';
import 'fa-cron-react-editor/dist/index.css';

export interface CronModalProps extends DragModalProps {
  initialValue?: string;
  onChange?: (v: string | undefined) => void;
}

/**
 * 系统定时任务实体新增、编辑弹框
 */
export default function CronModal({ children, initialValue, onChange, ...props }: CronModalProps) {
  const [cron, setCron] = useState<string>(initialValue || '* * * * * ?');
  const [times, setTimes] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    jobApi
      .quartzLatest(cron, 5)
      .then((res) => {
        setTimes(res.data);
        setErrorMsg(undefined);
      })
      .catch((e) => {
        setErrorMsg(e.response.data.message);
        setTimes([]);
      });
  }, [cron]);

  function onFinish() {
    if (onChange) {
      onChange(trim(cron));
    }
    setOpen(false);
  }

  return (
    <span>
      <span onClick={() => setOpen(true)}>{children || <a>cron表达式编辑</a>}</span>
      <DragModal
        title="cron表达式编辑"
        open={open}
        onOk={() => onFinish()}
        onCancel={() => setOpen(false)}
        width={844}
        style={{ top: 44 }}
        {...props}
      >
        <div>
          <CronEditor value={cron} onChange={setCron} />

          <div>最近5次运行时间</div>
          <div>
            {times.map((i) => (
              <div key={i}>{i}</div>
            ))}
          </div>
          {errorMsg && <div>{errorMsg}</div>}
        </div>
      </DragModal>
    </span>
  );
}
