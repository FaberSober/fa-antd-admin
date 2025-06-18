import React, { useEffect, useState } from 'react';
import { CronEditor } from 'fa-cron-react-editor';
import {jobApi} from '@ui/services/base';

import 'fa-cron-react-editor/dist/index.css';

/**
 * @author xu.pengfei
 * @date 2022/9/2
 */
export default function Cron() {
  const [cron, setCron] = useState<string>('* * * * * ?');
  const [times, setTimes] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (cron === undefined) {
      setTimes([]);
      setErrorMsg(undefined);
      return;
    }

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

  return (
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
  );
}
