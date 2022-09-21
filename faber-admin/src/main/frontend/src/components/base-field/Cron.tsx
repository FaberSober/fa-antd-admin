import React, {useEffect, useState} from 'react';
import { CronEditor } from 'fa-cron-react-editor';
import jobApi from '@/services/admin/job'
import {RES_CODE} from "@/configs/server.config";

import 'fa-cron-react-editor/dist/index.css'


export interface CronProps {
  value?: string;
  onChange?: (v:string|undefined) => void;
}

/**
 * @author xu.pengfei
 * @date 2022/9/2
 */
export default function Cron({ value, onChange }: CronProps) {
  const [cron, setCron] = useState<string>('* * * * * ?');
  const [times, setTimes] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState<string|undefined>(undefined);

  useEffect(() => {
    if (cron === undefined) {
      setTimes([])
      setErrorMsg(undefined)
      return;
    }

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

  return (
    <div>
      <CronEditor
        value={cron}
        onChange={setCron}
      />

      <div>最近5次运行时间</div>
      <div>
        {times.map((i) => <div key={i}>{i}</div>)}
      </div>
      {errorMsg && <div>{errorMsg}</div>}
    </div>
  )
}
