import React, {useEffect, useRef, useState} from 'react';
import {Map, MapTypeControl, Marker} from '@uiw/react-amap';
import {Button, Card, Input, message} from "antd";
import AMapAutoComplete from "@features/fa-admin-pages/components/map/AMapAutoComplete";
import AMapSearchSelect from "@features/fa-admin-pages/components/map/AMapSearchSelect";


/**
 * 高德地图
 * @author xu.pengfei
 * @date 2023/4/21 11:01
 */
export default function AMapBasic() {
  const geocoderRef = useRef<any>()

  const [pos, setPos] = useState<any>()

  const [address1, setAddress1] = useState<string>('北京市朝阳区阜荣街10号')
  const [status1, setStatus1] = useState<string>()
  const [pos1, setPos1] = useState<any>()

  const [status2, setStatus2] = useState<string>()
  const [address2, setAddress2] = useState<string>('')

  useEffect(() => {
    AMap.plugin(['AMap.Geocoder'], () => {
      const geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: '全国'
      })
      geocoderRef.current = geocoder;
    })
  }, [])

  // 使用geocoder做地理/逆地理编码
  function handleAddressToPos() {
    if (geocoderRef.current === undefined) return;
    geocoderRef.current.getLocation('北京市海淀区苏州街', (status:any, result:any) => {
      console.log('status', status, 'result', result)
      setStatus1(status)
      if (status === 'complete' && result.info === 'OK') {
        // result中对应详细地理坐标信息
        if (result.geocodes[0]) {
          const location = result.geocodes[0].location
          setPos1([location.lng, location.lat])
        }
      }
    })
  }

  function handlePosToAddress() {
    if (geocoderRef.current === undefined) return;
    if (pos === undefined) {
      message.error('请先选择坐标点')
      return;
    }
    geocoderRef.current.getAddress(pos, (status:any, result:any) => {
      console.log('status', status, 'result', result)
      setStatus2(status)
      if (status === 'complete' && result.info === 'OK') {
        // result为对应的地理位置详细信息
        setAddress2(result.regeocode.formattedAddress)
      }
    })
  }

  return (
    <div className="fa-full-content fa-bg-white fa-p12 fa-scroll-auto-y">
      <Card title="基础地图展示" className="fa-mb12">
        <Map style={{height: 200, width: 600}}/>
      </Card>

      <Card title="地图坐标拾取" className="fa-mb12">
        <Map
          style={{height: 200, width: 600}}
          onClick={(event) => {
            console.log('点击事件！', event);
            setPos([event.lnglat.lng, event.lnglat.lat])
          }}
        >
          {pos && <Marker position={new AMap.LngLat(pos[0], pos[1])}/>}
        </Map>
        <div>
          点击拾取坐标：lng: {pos && pos[0]}, lat: {pos && pos[1]}
        </div>
      </Card>

      <Card title="AutoComplete 输入提示" className="fa-mb12">
        <AMapAutoComplete/>
      </Card>

      <Card title="AMap.Geocoder - 正向地理编码方法" className="fa-mb12">
        <div>
          API网址：https://lbs.amap.com/api/javascript-api/guide/services/geocoder
        </div>
        <Input value={address1} onChange={e => setAddress1(e.target.value)} />
        <Button onClick={handleAddressToPos} className="fa-mt12">地址 -&gt; 经纬度</Button>
        <div className="fa-mt12">
          status: {status1}, pos: {JSON.stringify(pos1)}
        </div>
      </Card>

      <Card title="AMap.Geocoder - 逆向地理编码方法" className="fa-mb12">
        <div>
          API网址：https://lbs.amap.com/api/javascript-api/guide/services/geocoder
        </div>
        <Input value={JSON.stringify(pos)} />
        <Button onClick={handlePosToAddress} className="fa-mt12">经纬度 -&gt; 地址</Button>
        <div className="fa-mt12">
          status: {status2}, address: {address2}
        </div>
      </Card>

      <Card title="AMap.Geocoder - 逆向地理编码方法" className="fa-mb12">
        <AMapSearchSelect
          style={{height: 200, width: 600}}
          onSelect={(v) => {
            console.log('onSelect', v)
          }}
        />
      </Card>

      <Card title="MapTypeControl 涂层类型切换" className="fa-mb12">
        <Map style={{height: 200, width: 600}}>
          <MapTypeControl offset={[10, 10]} position="RT" />
        </Map>
      </Card>

      <div style={{height: 500 }} />
    </div>
  )
}
