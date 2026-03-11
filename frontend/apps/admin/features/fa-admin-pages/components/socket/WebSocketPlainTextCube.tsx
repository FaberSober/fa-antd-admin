import React, { type CSSProperties, useState } from 'react';
import useBus from 'use-bus';
import { FaUtils } from '@fa/ui';
import { isNil } from 'lodash';

export interface WebSocketPlainTextCubeProps {
  style?: CSSProperties;
  className?: string;
  channel?: string;
}

/**
 * @author xu.pengfei
 * @date 2024/11/22 11:13
 */
export default function WebSocketPlainTextCube({ style, className, channel }: WebSocketPlainTextCubeProps) {
  const [array, setArray] = useState<{ data: string, timestamp: number }[]>([]);

  useBus(
    ['@@ws/RECEIVE/PLAIN_TEXT'],
    ({ channel: ca, payload, timestamp }) => {
      if (isNil(channel)) {
        setArray([...array, { data: payload, timestamp }]);
      } else {
        if (channel === ca) {
          setArray([...array, { data: payload, timestamp }]);
        }
      }
      FaUtils.scrollToBottomById('WebSocketPlainTextCube', 100);
    },
    [array],
  );

  if (array.length === 0) return null;
  return (
    <div id="WebSocketPlainTextCube" style={{ maxHeight: 400, width: '100%', overflowY: 'auto', fontSize: '12px', ...style }} className={className}>
      {array.map((item, i) => (
        <div key={`${item.timestamp}-${i}`} className="fa-flex-row fa-mb4 fa-text-same-width-only">
          <div style={{width: 150}}>{FaUtils.getDateFullStr(Number(item.timestamp))}</div>
          <div className="fa-flex-1 fa-flex-wrap">{item.data}</div>
        </div>
      ))}
    </div>
  );
}
