import React, {useEffect, useState} from 'react';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import {trim} from 'lodash';
import {CronEditor} from "fa-cron-react-editor";
import jobApi from "@/services/admin/job";
import {RES_CODE} from "@/configs/server.config";
import 'fa-cron-react-editor/dist/index.css'


interface IProps extends DragModalProps {
  value?: string;
  onChange?: (v:string|undefined) => void;
}

/**
 * 系统定时任务实体新增、编辑弹框
 */
export default function CronModal({ children, value, onChange, ...props }: IProps) {
  const [cron, setCron] = useState<string>('* * * * * ?');
  const [times, setTimes] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState<string|undefined>(undefined);

  const [modalVisible, setModalVisible] = useState(false);

  // useEffect(() => {
  //   if (value !== cron && value !== undefined) {
  //     setCron(value)
  //   }
  // }, [])

  useEffect(() => {
    console.log('cron', cron)
    jobApi.quartzLatest(cron, 5).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setTimes(res.data)
        setErrorMsg(undefined)
      }
    }).catch((e) => {
      setErrorMsg(e.response.data.message)
      setTimes([])
    })
  }, [cron])

  function onFinish() {
    if (onChange) {
      onChange(trim(cron))
    }
    setModalVisible(false)
  }

  return (
    <span>
      <span onClick={() => setModalVisible(true)}>{children || <a>cron表达式编辑</a>}</span>
      <DragModal
        title="cron表达式编辑"
        visible={modalVisible}
        onOk={() => onFinish()}
        onCancel={() => setModalVisible(false)}
        width={844}
        style={{ top: 44 }}
        {...props}
      >
        <div>
          <CronEditor
            value={cron}
            onChange={(v) => {
              console.log('CronEditor#onChange', v)
              setCron(trim(v))
            }}
          />

          <div>最近5次运行时间</div>
          <div>
            {times.map((i) => <div key={i}>{i}</div>)}
          </div>
          {errorMsg && <div>{errorMsg}</div>}
        </div>
      </DragModal>
    </span>
  );
}
