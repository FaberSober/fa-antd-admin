import React, { useRef, useState, useEffect, CSSProperties } from 'react';
import { AutoComplete } from '@uiw/react-amap';

interface IProps {
  onSelectData?: (e: any) => void;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2020/12/28
 */
export default function MyAutoComplete({ onSelectData, style }: IProps) {
  const mapRef = useRef<any | null>();

  const [input, setInput] = useState();

  useEffect(() => {
    setInput(mapRef.current);
  }, []);

  return (
    <>
      <input type="text" ref={mapRef} style={style} />
      <div style={{ width: '100%' }}>
        {input && (
          <AutoComplete
            input={input}
            // @ts-ignore
            onSelect={(opts: any) => {
              if (onSelectData) onSelectData(opts);
            }}
          />
        )}
      </div>
    </>
  );
}
