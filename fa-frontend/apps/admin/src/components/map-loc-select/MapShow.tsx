// import React, {CSSProperties, useState} from 'react';
// import {Map, MapTypeControl, Marker, ScaleControl} from '@uiw/react-amap';

// export interface MapShowProps {
//   lng: number;
//   lat: number;
//   address?: string;
//   style?: CSSProperties;
// }

// /**
//  * @author xu.pengfei
//  * @date 2021/6/4
//  */
// export default function MapShow({ lng, lat, address, style }: MapShowProps) {
//   const [ready, setReady] = useState(false);

//   return (
//     <div style={style}>
//       <Map
//         center={[lng, lat]}
//         onComplete={() => {
//           setReady(true);
//         }}
//       >
//         <MapTypeControl
//           // @ts-ignore
//           offset={[10, 10]}
//           position="RT"
//         />
//         <ScaleControl offset={[10, 10]} position="RB" />
//         {ready && <Marker title={address} position={new AMap.LngLat(lng, lat)} />}
//       </Map>
//     </div>
//   );
// }
