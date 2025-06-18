# 滚动列表
## 一个竖向轮博滚动的示例(使用封装的组件)
1. 主要使用封装的`FaScrollList`组件；

```typescript jsx
import React, { useEffect, useState } from 'react';
import { Beam } from "@features/fa-beam-pages/types";
import { oprAuditApi } from "@features/fa-beam-pages/services";
import { FaEnums } from "@/types";
import { fileSaveApi } from "@fa/ui";
import { Image } from "antd";
import { FaScrollList } from "@features/fa-admin-pages/components";


function Info({label, value}: {label: string, value: any}) {
  return (
    <div className="fa-flex-row-center" style={{ fontSize: '16px', marginBottom: 12 }}>
      <div style={{width: 80}}>{label}:</div>
      <div>{value}</div>
    </div>
  )
}

/**
 * 实时检验信息
 * @author xu.pengfei
 * @date 2023/12/4 14:53
 */
export default function DataQualityAuditRealtimeList() {
  const [array, setArray] = useState<Beam.OprAudit[]>([]);

  useEffect(() => {
    oprAuditApi.listN({ sorter: 'crt_time DESC', query: { auditState: FaEnums.AuditEnum.PASS } }, 15).then(res => {
      const arr = res.data.map((item, index) => ({ ...item, index: index+1 }))
      setArray(arr)
    })
  }, [])

  return (
    <div className="fa-full fa-flex-column">
      <div
        className="fa-beam-data-screen-h2 fa-beam-data-link-title fa-mb12"
        onClick={() => {
          window.open('/admin/beam/prod/opr/audit', '_blank');
        }}
      >
        实时检验信息
      </div>

      <div className="fa-flex-1 fa-relative">
        <FaScrollList
          list={array}
          num={5}
          renderItem={v => {
            return (
              <div className="fa-relative fa-full fa-flex-row fa-border-b">
                <div className="fa-flex-1 fa-p12">
                  <Info label="发起人" value={v.crtName}/>
                  <Info label="发起时间" value={v.crtTime}/>
                  <Info label="梁片编号" value={v.beamNum}/>
                  <Info label="工序" value={v.process}/>
                  <Info label="审核状态" value={FaEnums.AuditEnumMap[v.auditState]}/>
                </div>

                <div className="fa-p12">
                  {v.auditImgs && v.auditImgs[0] && (
                    <Image
                      // width={100}
                      height={100}
                      src={fileSaveApi.genLocalGetFilePreview(v.auditImgs[0])}
                      preview={{src: fileSaveApi.genLocalGetFile(v.auditImgs[0])}}
                    />
                  )}
                </div>

                <div
                  style={{position: "absolute", bottom: 12, right: 12, width: 30, height: 30, borderRadius: 15, background: '#0e3092', fontSize: '16px'}}
                  className="fa-flex-center">
                  {v.index}
                </div>
              </div>
            )
          }}
        />
      </div>
    </div>
  );
}
```

## 一个竖向轮博滚动的示例(单文件完整实现)
```typescript jsx
import React, { useEffect, useRef, useState } from 'react';
import { useInterval, useSize } from "ahooks";
import { Beam } from "@features/fa-beam-pages/types";
import { oprAuditApi } from "@features/fa-beam-pages/services";
import { FaEnums } from "@/types";
import { fileSaveApi } from "@fa/ui";
import { Image } from "antd";


function Info({label, value}: {label: string, value: any}) {
  return (
    <div className="fa-flex-row-center" style={{ fontSize: '16px', marginBottom: 12 }}>
      <div style={{width: 80}}>{label}:</div>
      <div>{value}</div>
    </div>
  )
}

/**
 * 实时检验信息
 * @author xu.pengfei
 * @date 2023/12/4 14:53
 */
export default function DataQualityAuditRealtimeList() {
  const num = 5; // show item number
  const hoverRef = useRef(false)
  const [array, setArray] = useState<Beam.OprAudit[]>([]);
  const [arrayShow, setArrayShow] = useState<Beam.OprAudit[]>([]);
  const [arrayIndex, setArrayIndex] = useState<number>(0);
  const domRef = useRef<any | null>();
  const size = useSize(domRef);

  useEffect(() => {
    oprAuditApi.listN({ sorter: 'crt_time DESC', query: { auditState: FaEnums.AuditEnum.PASS } }, 15).then(res => {
      const arr = res.data.map((item, index) => ({ ...item, index: index+1 }))
      setArray(arr)
    })
  }, [])

  useEffect(() => {
    if (array.length <= num) {
      setArrayShow(array)
      return;
    }

    // cal window: (arrayIndex-1, [arrayIndex, arrayIndex+num-1], arrayIndex+num)
    const tripleList = [ ...array, ...array, ...array ]
    const showArr = tripleList.slice(arrayIndex + array.length - 1, arrayIndex + array.length + num + 1)
    setArrayShow(showArr)
  }, [array, arrayIndex])

  useInterval(() => {
    if (hoverRef.current) return;
    scrollDown()
  }, 2000)

  function updateIndex(newIndex: number) {
    let index = newIndex;
    if (index < 0) {
      index = array.length - 1
    }
    if (index >= array.length) {
      index = 0
    }
    setArrayIndex(index)
  }

  function scrollUp() {
    if (array.length < num) return;
    updateIndex(arrayIndex - 1)
  }

  function scrollDown() {
    if (array.length < num) return;
    updateIndex(arrayIndex + 1)
  }

  let height = 80;
  if (size && size.height) {
    height = size.height / num;
  }
  return (
    <div className="fa-full fa-flex-column">
      <div
        className="fa-beam-data-screen-h2 fa-beam-data-link-title fa-mb12"
        onClick={() => {
          window.open('/admin/beam/prod/opr/audit', '_blank');
        }}
      >
        实时检验信息
      </div>
      <div
        ref={domRef}
        className="fa-flex-1 fa-relative fa-scroll-hidden"
        onMouseOver={() => hoverRef.current = true}
        onMouseLeave={() => hoverRef.current = false}
        onWheel={e => {
          console.log('onWheel', e.deltaY)
          if (e.deltaY > 0) { // wheel up
            scrollUp()
          } else { // wheel down
            scrollDown()
          }
        }}
      >
        {arrayShow.map((v, i) => {
          return (
            <div
              key={v.id}
              style={{
                transition: 'all ease-in-out 0.3s',
                height: height,
                position: 'absolute',
                top: (i - 1) * height,
                left: 0,
                right: 0,
              }}
              className="fa-flex-row fa-border-b"
            >
              <div className="fa-relative fa-full fa-flex-row">
                <div className="fa-flex-1 fa-p12">
                  <Info label="发起人" value={v.crtName}/>
                  <Info label="发起时间" value={v.crtTime}/>
                  <Info label="梁片编号" value={v.beamNum}/>
                  <Info label="工序" value={v.process}/>
                  <Info label="审核状态" value={FaEnums.AuditEnumMap[v.auditState]}/>
                </div>

                <div className="fa-p12">
                  {v.auditImgs && v.auditImgs[0] && (
                    <Image
                      // width={100}
                      height={100}
                      src={fileSaveApi.genLocalGetFilePreview(v.auditImgs[0])}
                      preview={{src: fileSaveApi.genLocalGetFile(v.auditImgs[0])}}
                    />
                  )}
                </div>

                <div style={{ position: "absolute", bottom: 12, right: 12, width: 30, height: 30, borderRadius: 15, background: '#0e3092', fontSize: '16px' }} className="fa-flex-center">
                  {v.index}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
```
