import React, {useContext, useState} from 'react';
import {Button, Card, ColorPicker, Space, Switch, Tag} from "antd";
import {InputColor, ThemeLayoutContext} from "@fa/ui";


/**
 * @author xu.pengfei
 * @date 2023/6/6 15:41
 */
export default function DemoTheme() {
  const { setColorPrimary, themeDark, setThemeDark } = useContext(ThemeLayoutContext);

  function handleChangeThemeColor(color: string) {
    // set antd theme primary color
    setColorPrimary(color);

    // set css theme color
    const rootDom = document.getElementsByTagName('body')[0].style;
    rootDom.setProperty('--primary-color', color);
  }

  const primaryColor = document.body.style.getPropertyValue('--primary-color');

  const [color, setColor] = useState('#FF0000')

  return (
    <div className="fa-full-content fa-bg-white fa-p12 fa-flex-column">
      <Card title="颜色选择器" className="fa-mb12">
        <ColorPicker
          value={color}
          onChange={(v,hex) => {
            console.log('ColorPicker.onChange', v, hex)
            setColor(hex)
          }}
        />
      </Card>

      <Card title="亮色、暗色、主题色切换" className="fa-mb12">
        <div className="fa-flex-row-center">
          <InputColor value={primaryColor} onChange={(v:string) => handleChangeThemeColor(v)} style={{width: 25, height: 25}} />

          <div className="fa-flex-row-center fa-mr12">
            {['#F5222D', '#faad14', '#50CEE3', '#1677ff', '#722ED1', '#053553'].map((i) => (
              <div key={i} className="fa-hover" style={{ width: 25, height: 25, background: i }} onClick={() => handleChangeThemeColor(i)} />
            ))}
          </div>

          <Switch checkedChildren="暗色" unCheckedChildren="亮色" checked={themeDark} onChange={setThemeDark} />
        </div>

        <div className="fa-mt12">
          各组件展示效果：
        </div>

        <div className="fa-mt12 fa-flex-column">
          <Space>
            <Button type="primary">Primary Button</Button>
            <Button>Default Button</Button>
            <Button type="dashed">Dashed Button</Button>
            <Button type="text">Text Button</Button>
            <Button type="link">Link Button</Button>
            <Button danger>Danger Button</Button>
            <Button type="primary" danger>Danger Primary Button</Button>
          </Space>

          <Space size={[0, 8]} wrap className="fa-mt12">
            <Tag color="success">success</Tag>
            <Tag color="processing">processing</Tag>
            <Tag color="error">error</Tag>
            <Tag color="warning">warning</Tag>
            <Tag color="default">default</Tag>
          </Space>

          <Space size={[0, 8]} wrap className="fa-mt12">
            <Tag color="#f50">#f50</Tag>
            <Tag color="#2db7f5">#2db7f5</Tag>
            <Tag color="#87d068">#87d068</Tag>
            <Tag color="#108ee9">#108ee9</Tag>
          </Space>
        </div>
      </Card>
    </div>
  )
}
