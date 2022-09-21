import { Link } from 'react-router-dom'
import type { FC } from 'react'
import { Button } from 'antd'
import {HeartOutlined} from "@ant-design/icons";

const index: FC = () => {
  return (
    <div>
        <div>
            <p>index.vue</p>
            <Link to="/blog">
                blog
            </Link> |
            <Link to="/about">
                about
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
    </div>
  )
}

export default index
