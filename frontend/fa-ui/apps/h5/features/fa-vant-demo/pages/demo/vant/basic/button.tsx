import React from 'react';
import { Button } from 'react-vant';


/**
 * @author xu.pengfei
 * @date 2023/4/6 11:12
 */
export default function button() {
  return (
    <div className='demo-button'>
      <Button type='primary'>Primary</Button>
      <Button type='info'>Info</Button>
      <Button type='default'>Default</Button>
      <Button type='warning'>Warning</Button>
      <Button type='danger'>Danger</Button>
    </div>
  )
}
