import React from "react";
import {Link} from 'react-router-dom'
import {Button} from 'antd'
import {HeartOutlined} from "@ant-design/icons";


export default function App() {
  return (
    <div>
      <div>
        <p>index.vue</p>
        <Link to="/blog">
          blog
        </Link> |
        <Link to="/login">
          login
        </Link> |
        <Link to="/components">
          components
        </Link> |
        <Link to="/xxx">
          not exists
        </Link>
      </div>
      <div>
        <Button type="primary" icon={<HeartOutlined />}>Hello</Button>
      </div>
      <div style={{ fontSize: '30px' }}>
        icon:
        <i className="fa-solid fa-user"></i>

        <i className="fa-regular fa-user"></i>

        <i className="fa-brands fa-github-square"></i>
      </div>

    </div>
  )
}
