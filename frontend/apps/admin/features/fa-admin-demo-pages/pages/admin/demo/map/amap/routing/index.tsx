import React, { useEffect, useRef, useState } from 'react';
import {Map, MapTypeControl, Marker} from '@uiw/react-amap';
import { Badge, Button, Checkbox, Input, message, Modal, Slider, Space, Tag, Tooltip } from "antd";
import { FaUtils, FaResizeHorizontal, FaFlexRestLayout } from "@fa/ui";
import { find, findIndex, isNil, max, maxBy, min, minBy, trim } from "lodash";
import { LockOutlined, PlusOutlined, UnlockOutlined } from "@ant-design/icons";
import similarity from "similarity";
import './index.scss'


let routeList: Route[] = [
  {
    id: 1,
    routeStr: "故宫博物院-长安街-祈年大街-天坛公园",
    roads: [],
  },
]

routeList.forEach(i => {
  i.roads = parseRouteStr(i.routeStr)
})

// handleReadCache()

// function handleReadCache() {
//   try {
//     const cacheStr = localStorage.getItem('fa.demo.routeList')
//     if (cacheStr) {
//       const routeListCache = JSON.parse(localStorage.getItem('fa.demo.routeList')!)
//       routeList = routeList.map(route => {
//         const findCache = find(routeListCache, i => i.id === route.id)
//         if (findCache) {
//           return { ...route, ...findCache }
//         }
//         return route;
//       })
//     }
//   } catch (e) {}
// }

function parseRouteStr(routeStr: string) {
  const routeStrList = routeStr.split(/[--]+/)
  // console.log('routeStrList', routeStrList)

  const roadsArr:Road[] = routeStrList.map((item, index) => {
    if (index === 0) {
      return { id: index, name: item, type: 'start' };
    } else if (index === routeStrList.length - 1) {
      return { id: index, name: item, type: 'end' };
    }
    return { id: index, name: item, type: 'road' };
  })
  return roadsArr;
}

interface Pos {
  lng: number;
  lat: number;
}
type PosArr = [number, number]

interface Route {
  id: number;
  routeStr: string;
  roads: Road[];
}

interface Road {
  id: number;
  type: 'start'|'road'|'end';
  name: string;
  lockPos?: boolean; // 是否锁定位置，锁定后，在自动规划中不会检索定位
  loc?: Pos;
  path?: Pos[];
}

interface SearchPOI {
  id: string;
  name: string;
  lng: number;
  lat: number;
  distance: number; // 与上一点的距离
  similarity: number; // 综合权重：距离0.3+文本交叉口相似度0.3+文本道路名称相似度0.4
  simi1: number;
  simi2: number;
  simi3: number;
  simi4: number;
}

/**
 * amap routing manage
 * @author xu.pengfei
 * @date 2025/4/27 10:16
 */
export default function AMapRouting() {
  const [mode, setMode] = useState<'list'|'road'>('list')

  const [route, setRoute] = useState<Route>() // 当前编辑的路径
  const [roadEditing, setRoadEditing] = useState<Road>()
  const [search, setSearch] = useState<string|undefined>()
  const [searchType, setSearchType] = useState<string|undefined>()
  const [searchResults, setSearchResults] = useState<SearchPOI[]>([])
  const [planing, setPlaning] = useState(false)
  const [clickJump, setClickJump] = useState(false)
  const [searchNearBy, setSearchNearBy] = useState(true)
  const [searchRadius, setSearchRadius] = useState(100)
  const [drivingResult, setDrivingResult] = useState<any>()

  const roads = route ? route.roads : [];

  const mapRef = useRef<any>();
  const drivingRef = useRef<any>();
  const placeSearchRef = useRef<any>();

  useEffect(() => {
    console.log('mapRef:', mapRef)
    // handleReadCache()
  }, []);

  function handleEditRoute(item: Route) {
    setMode('road')
    setRoute(item)
    setRoadEditing(undefined)
    setSearch(undefined)
    setSearchResults([])
    setPlaning(false)
  }

  function initPlugins() {
    // 搜索：https://lbs.amap.com/api/javascript-api-v2/tutorails/search-poi
    placeSearchRef.current = new AMap.PlaceSearch({
      pageSize: 10, //单页显示结果条数
      pageIndex: 1, //页码
      // city: "010", //兴趣点城市
      // citylimit: true, //是否强制限制在设置的城市内搜索
      // map: map, //展现结果的地图实例
      // panel: "my-panel", //参数值为你页面定义容器的 id 值<div id="my-panel"></div>，结果列表将在此容器中进行展示。
      autoFitView: true, //是否自动调整地图视野使绘制的 Marker 点都处于视口的可见范围
    });

    // 路线规划：https://lbs.amap.com/api/javascript-api-v2/tutorails/car-dir
    drivingRef.current = new AMap.Driving({
      map: mapRef.current.map,
      panel: "fa-driving-panel", //参数值为你页面定义容器的 id 值<div id="my-panel"></div>
    });
  }

  // 使用geocoder做地理/逆地理编码
  async function handleAddressSearch(searchName: string|undefined, type: string, road?: Road) {
    if (isNil(searchName) || trim(searchName) === '') {
      return;
    }
    if (search !== trim(searchName)) {
      setSearch(trim(searchName))
    }
    if (type !== searchType) {
      setSearchType(type)
    }

    let searchNearByFlag = searchNearBy
    let cpoint:PosArr|undefined = undefined; // 中心点坐标
    const roadEditingIndex = findIndex(roads, i => i.id === road?.id)
    if (roadEditingIndex === 0) {
      searchNearByFlag = false
    } else {
      for (let i = roadEditingIndex - 1; i >= 0; i--) {
        const preRoad = roads[i]
        if (preRoad.loc) {
          cpoint = [preRoad.loc.lng, preRoad.loc.lat]
          break;
        }
      }
    }

    let sr = []
    if (searchNearByFlag && cpoint) {
      sr = await mapSearchNearBy(trim(searchName), cpoint, searchRadius * 1000, type)
    } else {
      sr = await mapSearch(trim(searchName), type)
    }
    setSearchResults(sr)
    if (clickJump && sr && sr[0]) {
      mapRef.current.map.panTo([sr[0].lng, sr[0].lat])
    }
  }

  function mapSearch(searchName:string, type: string): Promise<SearchPOI[]> {
    return new Promise((resolve) => {
      const placeSearch = placeSearchRef.current;
      placeSearch.setPageSize(20)
      placeSearch.setType(type)
      placeSearch.search(trim(searchName), (status:any, result:any) => {
        console.log('mapSearch', 'searchName', searchName, 'type', type, 'status', status, 'result', result)
        if (status === "complete") {
          //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
          //查询成功时，result 即为对应的驾车导航信息
          if (result && result.info === 'OK') {
            const sr:SearchPOI[] = result.poiList.pois.map((i:any) => {
              return {
                id: i.id,
                name: i.name,
                lng: i.location.lng,
                lat: i.location.lat,
                distance: NaN,
                similarity: NaN,
              }
            })
            resolve(sr)
          } else {
            resolve([])
          }
        } else {
          if (status !== 'no_data') {
            message.error("查询地点数据失败：" + status + ":" + JSON.stringify(result));
          }
          console.log("查询地点数据失败：" + status + ":" + JSON.stringify(result));
          resolve([])
        }
      });
    })
  }

  /**
   *
   * @param searchName
   * @param cpoint
   * @param searchRadius
   * @param type 设置查询类别，多个类别用“|”分割，https://lbs.amap.com/api/javascript-api-v2/documentation#placesearch
   */
  function mapSearchNearBy(searchName:string, cpoint:PosArr, searchRadius:number, type: string): Promise<SearchPOI[]> {
    return new Promise((resolve) => {
      const placeSearch = placeSearchRef.current;
      placeSearch.setPageSize(20)
      placeSearch.setType(type)
      placeSearch.searchNearBy(trim(searchName), cpoint, searchRadius, (status:any, result:any) => {
        console.log('mapSearchNearBy', 'searchName', searchName, 'type', type, 'cpoint', cpoint, 'searchRadius', searchRadius, 'status', status, 'result', result)
        if (status === "complete") {
          //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
          //查询成功时，result 即为对应的驾车导航信息
          if (result && result.info === 'OK') {
            const sr = result.poiList.pois.map((i:any) => {
              return {
                id: i.id,
                name: i.name,
                lng: i.location.lng,
                lat: i.location.lat,
                distance: i.distance,
                similarity: NaN,
              }
            })
            resolve(sr)
          } else {
            resolve([])
          }
        } else {
          if (status !== 'no_data') {
            message.error("查询地点数据失败：" + status + ":" + JSON.stringify(result));
          }
          console.log("查询地点数据失败：" + status + ":" + JSON.stringify(result));
          resolve([])
        }
      });
    })
  }

  function handleClick(item: Road, index: number) {
    if (item.id === roadEditing?.id) {
      setRoadEditing(undefined)
      return;
    }

    setRoadEditing(item)
    setTimeout(() => {
      const searchName = getSearchName(item, index)
      const searchType = getSearchType(item)
      handleAddressSearch(searchName, searchType, item)
    }, 200)
  }

  function handleLockRoadItem(item: Road, lockPos: boolean) {
    if (isNil(route)) return;
    setRoute({
      ...route,
      roads: route.roads.map(i => {
        if (i.id === item.id) {
          return { ...i, lockPos }
        }
        return i;
      })
    })
  }

  function handleLocRoadItem(item: Road) {
    console.log('click', item)
    setRoadEditing(item)
    if (isNil(item.loc)) {
      return;
    }
    mapRef.current.map.panTo([item.loc.lng, item.loc.lat])
  }

  function handleClickSearchResult(item: SearchPOI) {
    mapRef.current.map.panTo([item.lng, item.lat])
  }

  function handleSelSearchResult(item: SearchPOI) {
    mapRef.current.map.panTo([item.lng, item.lat])
    handleSelRoadEditingLoc(item.lng, item.lat)
  }

  function handleSelRoadEditingLoc(lng: number, lat: number) {
    if (isNil(roadEditing)) {
      message.error("未选中左侧路径")
      return;
    }
    const roadsNew = roads.map(r => {
      if (r.id === roadEditing.id) {
        return { ...r, loc: { lng, lat } }
      }
      return r;
    })
    if (route) {
      setRoute({ ...route, roads: roadsNew })
      routeList = routeList.map(i => {
        if (i.id === route.id) {
          return { ...route, roads: roadsNew }
        }
        return i
      })
      localStorage.setItem('fa.demo.routeList', JSON.stringify(routeList))
    }
  }

  function getPreRoadLoc(start: number): PosArr|null {
    let cpoint:PosArr|null = null; // 中心点坐标
    for (let j = start; j >= 0; j--) {
      const preRoad = roads[j]
      if (preRoad.loc) {
        cpoint = [preRoad.loc.lng, preRoad.loc.lat]
        break;
      }
    }
    return cpoint;
  }

  function getSearchType(road: Road) {
    if (road.type === 'start' || road.type === 'end') {
      return "公司|企业|楼宇|商务住宅|产业园区|产业园区"
    }
    if (road.name.indexOf('收费站') > -1) {
      return "收费站"
    }
    if (road.name.indexOf('高速') > -1) {
      return "交通地名|路口名|道路名|收费站"
    }
    return "交通地名|路口名|道路名|收费站";
  }

  function getSearchName(road: Road, index: number, reverse: boolean = false) {
    let preRoad = index > 0 ? roads[index - 1] : null;
    let searchName = road.name
    if (searchName.indexOf('桥') > -1) { // 一般桥、收费站的定位会比较准
      return searchName;
    }
    if (searchName.indexOf('收费站') > -1) {
      return searchName;
    }
    if (preRoad && index > 1 && index < roads.length - 1) {
      if (preRoad.name.indexOf('桥') > -1) {
        return searchName;
      }
      searchName = preRoad.name + '与' + road.name + '交叉口'
      if (reverse) {
        searchName = road.name + '与' + preRoad.name + '交叉口'
      }
    }
    return searchName;
  }

  async function searchAgent(searchName: string, searchType: string, preCpoint: PosArr|null) {
    let sr1: SearchPOI[] = []

    // 先使用附近搜索
    if (preCpoint) {
      sr1 = await mapSearchNearBy(searchName, preCpoint, 100 * 1000, searchType)
    }

    // 若附近搜索未检索到，使用全局搜索
    if (sr1.length === 0) {
      sr1 = await mapSearch(searchName, searchType)
    }

    // 若还是未找到，不设置type全局搜索
    if (sr1.length === 0) {
      if (preCpoint) {
        sr1 = await mapSearchNearBy(searchName, preCpoint, 100 * 1000, '')
      }
      if (sr1.length === 0) {
        sr1 = await mapSearch(searchName, '')
      }
    }
    return sr1;
  }

  async function handleAutoPlan() {
    if (isNil(route)) return;
    setPlaning(true)
    // 循环查询地点
    for (let i = 0; i < roads.length; i++) {
      try {
        const road = roads[i]
        console.log((i+1) + ".开始检索-------------" + road.name + "-------------")
        if (road.lockPos) {
          console.log('锁定位置，跳过自动检索')
          continue;
        }
        let preRoad = i > 0 ? roads[i - 1] : null;

        // 确定搜索名称
        const searchName = getSearchName(road, i)
        let searchType = getSearchType(road)
        console.log((i+1) + ".开始检索--" + searchName)

        let preCpoint = getPreRoadLoc(i - 1)
        let sr1 = await searchAgent(searchName, searchType, preCpoint)
        if (road.name.indexOf("高速") > -1) {
          let sr2 = await searchAgent(road.name, searchType, preCpoint)
          sr1 = [...sr1, ...sr2]
        }

        if (isNil(sr1) || sr1.length === 0) {
          console.warn("未检索到定位：" + road.name)
          continue;
        }
        // 从结果中找到最相近的结果， TODO 考虑使用相似度排序，或者按照距离远近排序
        sr1.forEach(sr => {
          let distance = 0;
          if (preRoad?.loc) {
            distance = AMap.GeometryUtil.distance([preRoad.loc.lng, preRoad.loc.lat], [sr.lng, sr.lat])
          }
          sr.distance = distance
          sr.similarity = distance
        })
        // 过滤距离太远的，只取100km范围内的点
        if (road.name.indexOf("高速") === -1) {
          sr1 = sr1.filter(i => i.distance < 100 * 1000) // 过滤100km范围内的点
        }
        // 计算文本相似度
        const distanceArr = sr1.map(i => i.distance)
        const minDis = min(distanceArr) as number
        const maxDis = max(distanceArr) as number
        const deltaDis = maxDis - minDis
        sr1.forEach(sr => {
          const simi1 = similarity(searchName, sr.name)
          // console.log('simi1', simi1, searchName, sr.name)

          const searchNameReverse = getSearchName(road, i, true)
          const simi2 = similarity(searchNameReverse, sr.name)

          const simi3 = similarity(road.name, sr.name)
          // console.log('simi2', simi2, road.name, sr.name)

          // 将距离映射到[0,1]的区间内做权重计算
          const delta = sr.distance - minDis;
          let simi4 = 0;
          if (deltaDis > 0) {
            simi4 = delta / deltaDis
          }
          simi4 = 1 - simi4
          // console.log('simi3', simi3, sr.distance, delta)

          sr.simi1 = simi1
          sr.simi2 = simi2
          sr.simi3 = simi3
          sr.simi4 = simi4
          if (road.name.indexOf("高速") > -1) {
            sr.similarity = 0.2 * simi1 + 0.2 * simi2 + 0.2 * simi3 + 0.4 * simi4;
          } else {
            sr.similarity = 0.1 * simi1 + 0.1 * simi2 + 0.2 * simi3 + 0.6 * simi4;
          }
        })

        const srMin = maxBy(sr1, i => i.similarity)
        if (srMin) {
          road.loc = { lng: srMin.lng, lat: srMin.lat }
        }
        console.log('srMin', srMin, 'sr1', sr1)
        updateRoute(road)

        await delay(1000)
      } catch (e) {
        console.log(e)
      }
    }
    setRoute({ ...route, roads })
    setPlaning(false)
    message.success("自动规划完成")
  }

  function updateRoute(road: Road) {
    if (isNil(route)) return;
    setRoute({
      ...route,
      roads: route.roads.map(i => {
        if (i.id === road.id) {
          return { ...i, road }
        }
        return i;
      })
    })
  }

  function delay(time:number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, time)
    })
  }

  function handlePlan() {
    const start = roads[0]
    const end = roads[roads.length - 1]
    if (isNil(start.loc)) {
      message.error("未设置起点坐标")
      return;
    }
    if (isNil(end.loc)) {
      message.error("未设置终点坐标")
      return;
    }
    setPlaning(true)
    setDrivingResult(undefined)
    const driving = drivingRef.current
    driving.clear()
    // const points = [
    //   // [start.loc.lng, start.loc.lat], //起始点坐标
    //   // [end.loc.lng, end.loc.lat], //终点坐标
    //   { keyword: '北京市地震局（公交站）',city:'北京' },
    //   { keyword: '亦庄文化园（地铁站）',city:'北京' }
    // ]
    const startPoint = new AMap.LngLat(start.loc.lng, start.loc.lat)
    const endPoint = new AMap.LngLat(end.loc.lng, end.loc.lat)
    const waypoints = roads.slice(1, roads.length - 1).filter(i => i.loc).map(i => new AMap.LngLat(i.loc!.lng, i.loc!.lat))
    //获取起终点规划线路
    driving.search(startPoint, endPoint, {waypoints}, function (status: any, result: any) {
      setPlaning(false)
      console.log('search', 'status', status, 'result', result)
      if (status === "complete") {
        //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
        //查询成功时，result 即为对应的驾车导航信息
        console.log(result);
        setDrivingResult(result)
      } else {
        console.log("获取驾车数据失败：" + result);
        message.error("获取驾车数据失败：" + result);
      }
    });
  }

  function handleRefineGoBack() {
    // 查找掉头点，将重复点设置为新的途径点
    if (isNil(drivingResult)) return;
    const steps:any[] = drivingResult.routes[0].steps;
    const stepPathList:any[] = []
    steps.forEach(s => {
      stepPathList.push(...s.path)
    })
    console.log('stepPathList', stepPathList)
    roads.map((road) => {
      if (road.type !== 'road') return;
      if (isNil(road.loc)) return;

      const roadLoc = [road.loc.lng, road.loc.lat]

      let minDistance = undefined;
      let preDistance = undefined;
      for (let i = 0; i < stepPathList.length; i++) {
        const step = stepPathList[i]
        const distance = AMap.GeometryUtil.distance(roadLoc, [step.lng, step.lat])
        if (minDistance === undefined) {
          minDistance = distance;
        }
        if (preDistance === undefined) {
          preDistance = distance;
        }
        if (distance < minDistance) {
          minDistance = distance
          // console.log('minDistance', minDistance, road.name)
        }
        if (distance < preDistance) {
          console.log('靠近>>>', distance, road.name)
        } else if (distance > preDistance) {
          console.log('远离---', distance, road.name)
        }
        // 50米内的坐标


        preDistance = distance;
      }
    })
  }

  function handleClearPos() {
    if (isNil(route)) return;
    Modal.confirm({
      title: '清空点位',
      content: '确认清空点位？',
      onOk: () => {
        setRoute({
          ...route,
          roads: route.roads.map(i => ({ ...i, lockPos: false, loc: undefined }))
        })
      },
    })
  }

  return (
    <div className="fa-full-content fa-bg-white fa-routing">
      <Map
        ref={mapRef}
        style={{height: '100%', width: '100%'}}
        onClick={(event: any) => {
          // console.log('点击事件！', event);
          if (roadEditing) {
            handleSelRoadEditingLoc(event.lnglat.lng, event.lnglat.lat)
          }
        }}
        onComplete={() => initPlugins()}
      >
        <MapTypeControl
          offset={[10, 110]}
          position="RB"
        />

        {roads.filter(i => i.loc).map(i => {
          const prefix = i.type === 'start' ? '起点' :
                          i.type === 'end' ? '终点' : '途径'
          const bgColor = i.type === 'start' ? 'lightcyan' :
            i.type === 'end' ? 'lightsalmon' : 'lightgoldenrodyellow'
          return (
            <Marker
              key={i.id}
              visible
              title={i.name}
              position={new AMap.LngLat(i.loc.lng, i.loc.lat)}
              label={{
                // 设置文本标注偏移量
                // offset: new AMap.Pixel(20, 20),
                // 设置文本标注内容
                content: `<div class="fa-marker-info" style="background: ${bgColor}">${prefix}：${i.name}</div>`,
                // 设置文本标注方位
                direction: 'top'
              }}
              onClick={() => setRoadEditing(i)}
            />
          )
        })}
        {searchResults.map(i => (
          <Marker
            key={i.id}
            visible
            title={i.name}
            position={new AMap.LngLat(i.lng, i.lat)}
            label={{
              // 设置文本标注偏移量
              // offset: new AMap.Pixel(20, 20),
              // 设置文本标注内容
              content: `<div class="fa-marker-info">${i.name}</div>`,
              // 设置文本标注方位
              direction: 'top'
            }}
            onClick={() => handleSelSearchResult(i)}
          />
        ))}
      </Map>

      <div style={{ position: 'absolute', top: 12, left: 12, bottom: 12 }}>
        <div id="fa-route-list" style={{ width: 420, height: '100%' }} className="fa-bg-white fa-radius">
          {mode === 'list' && (
            <div className="fa-full fa-scroll-auto-y">
              <div>
                {routeList.map(i => {
                  return (
                    <div key={i.id} className="fa-p12 fa-border-b fa-hover" onClick={() => handleEditRoute(i)}>
                      <div>
                        <Badge count={i.id} />
                        <span>{i.routeStr}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {mode === 'road' && (
            <div className="fa-flex-column fa-full">
              <Space className="fa-p4 fa-flex-wrap">
                <Button onClick={() => setMode('list')}>返回</Button>
                <Button onClick={handleAutoPlan} loading={planing}>自动规划</Button>
                <Button onClick={handlePlan} loading={planing}>规划路径</Button>
                <Button onClick={handleRefineGoBack}>优化掉头</Button>
                <Button onClick={() => {
                  drivingRef.current.clear()
                  setDrivingResult(undefined)
                }}>清空路径</Button>
                <Button onClick={handleClearPos}>清空点位</Button>
                <Checkbox checked={clickJump} onChange={e => setClickJump(e.target.checked)}>搜索跳转</Checkbox>
              </Space>

              <FaFlexRestLayout>
                {roads.map((item, index) => {
                  const editing = roadEditing?.id === item.id
                  let isLoc = !isNil(item.loc)
                  return (
                    <div
                      key={item.id}
                      className="fa-flex-row-center fa-hover"
                      style={{
                        background: editing ? 'lightgreen' : 'transparent',
                        paddingRight: 4,
                      }}
                      onClick={() => handleClick(item, index)}
                    >
                      {item.type === 'start' && <div style={{padding: 6, width: 60}} className="fa-flex-column-center">
                        <Tag color="#2db7f5" style={{margin: 0}}>起点</Tag>
                      </div>}
                      {item.type === 'road' && <div style={{padding: 6, width: 60}} className="fa-text-center">｜</div>}
                      {item.type === 'end' && <div style={{padding: 6, width: 60}} className="fa-flex-column-center">
                        <Tag color="#f50" style={{margin: 0}}>终点</Tag>
                      </div>}
                      <div className="fa-flex-1">{item.name}</div>
                      <Space onClick={FaUtils.preventEvent}>
                        {item.lockPos && (
                          <Tooltip title="锁定中，在自动规划中不会检索定位">
                            <Button shape="circle" icon={<LockOutlined/>} size="small" onClick={() => handleLockRoadItem(item, false)}></Button>
                          </Tooltip>
                        )}
                        {!item.lockPos && isLoc && (
                          <Tooltip title="锁定位置，锁定后，在自动规划中不会检索定位">
                            <Button shape="circle" icon={<UnlockOutlined />} size="small" className="fa-hover-show" onClick={() => handleLockRoadItem(item, true)}></Button>
                          </Tooltip>
                        )}
                        {isLoc && <Button shape="circle" icon={<PlusOutlined/>} size="small" onClick={() => handleLocRoadItem(item)}/>}
                      </Space>
                    </div>
                  )
                })}
              </FaFlexRestLayout>
            </div>
          )}
        </div>
        <FaResizeHorizontal domId="fa-route-list" position="right" minWidth={200}/>
      </div>

      <div style={{position: 'absolute', top: 12, right: 12, bottom: drivingResult ? 12 : undefined }} className="fa-flex-column">
        <div className="fa-relative">
          <div id="fa-search-result" style={{width: 300, minHeight: 100}} className="fa-bg-white fa-radius">
            <div className="fa-text-center fa-p4">
              <Input.Search
                value={search}
                onChange={e => setSearch(e.target.value)}
                allowClear
                onClear={() => setSearchResults([])}
                onSearch={(value, event, source) => source?.source === 'input' && handleAddressSearch(value, searchType||'', roadEditing)}
              />
            </div>
            <div className="fa-text-center fa-p4">
              <Input value={searchType} onChange={e => setSearchType(e.target.value)} allowClear addonBefore="搜索类型" placeholder="设置查询类别，多个类别用“|”分割" />
            </div>
            <div className="fa-flex-row-center fa-p4" style={{height: 42}}>
              <div>
                <Tooltip title="以上一个点的周边进行搜索">
                  <Checkbox checked={searchNearBy} onChange={e => setSearchNearBy(e.target.checked)}>周边搜索</Checkbox>
                </Tooltip>
              </div>
              {searchNearBy && (
                <>
                  <div className="fa-flex-1">
                    <Slider min={1} max={1000} value={searchRadius} onChange={setSearchRadius} onChangeComplete={(v) => {
                      setSearchRadius(v)
                    }}/>
                  </div>
                  <div className="fa-ml4">{searchRadius}km</div>
                </>
              )}
            </div>
            <div className="fa-flex-column">
              {searchResults.map(i => {
                return (
                  <div key={i.id} className="fa-flex-row-center fa-hover">
                    <div className="fa-flex-1 fa-p4" onClick={() => handleClickSearchResult(i)}>{i.name}</div>
                    <Button type="text" size="small" onClick={() => handleSelSearchResult(i)}>选中</Button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="fa-flex-1 fa-relative">
          <div className="fa-full-content fa-scroll-auto-y">
            <div id="fa-driving-panel"></div>
          </div>
        </div>
        <FaResizeHorizontal domId="fa-search-result" position="left" minWidth={200}/>
      </div>
      {/*<Space style={{position: 'absolute', top: 12, right: 12}}>*/}
      {/*  <Button>Road</Button>*/}
      {/*</Space>*/}
    </div>
  )
}
