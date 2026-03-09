import { FaIconPro } from "@/components";
import { BaseDrawer, useOpen } from '@fa/ui';
import { useWorkFlowStore } from "@features/fa-flow-pages/components/flow/stores/useWorkFlowStore";
import { Flw, FlwEnums } from "@features/fa-flow-pages/types";
import { Form, Input, InputNumber, Radio, Select, Space, TimePicker } from "antd";
import { get } from "lodash";
import { useMemo } from 'react';
import { NodeCloseBtn } from '../cubes';
import { useDelNode } from "../hooks";
import AddNode from './AddNode';


/**
 * 触发器
 * @author xu.pengfei
 * @date 2025/8/19 22:11
 */
export default function Trigger({ node, parentNode }: Flw.BasicNodeProps) {
  const [form] = Form.useForm();
  const [open, show, hide] = useOpen()

  const updateNode = useWorkFlowStore(state => state.updateNode);
  const updateNodeProps = useWorkFlowStore(state => state.updateNodeProps);
  const readOnly = useWorkFlowStore(state => state.readOnly);

  const { delNode } = useDelNode(node, parentNode);

  async function handleValuesChange(av: any) {
    let time = '1:m'
    if (av.delayType === FlwEnums.NodeDelayType.FIXED) {
      const timeNum = av.timeNum || 1;
      const timeType = av.timeType || 'm';
      time = `${timeNum}:${timeType}`;
    } else if (av.delayType === FlwEnums.NodeDelayType.CAL) {
      time = av.timeCal ? av.timeCal.format('HH:mm:ss') : '00:01:00';
    }
    const nodeNew = {
      ...node,
      delayType: av.delayType,
      triggerType: av.triggerType,
      extendConfig: {
        ...node.extendConfig,
        time,
        args: av.args,
        trigger: av.trigger,
      },
    }
    updateNode(nodeNew)
  }

  function showDrawer() {
    show()
    const time = get(node, 'extendConfig.time'); // 形如：1:m 或 17:02:53
    form.setFieldsValue({
      triggerType: node.triggerType,
      delayType: node.delayType,
      args: get(node, 'extendConfig.args'),
      trigger: get(node, 'extendConfig.trigger'),
      timeNum: time ? parseInt(time) : undefined,
      timeType: time ? time.replace(/^\d+:/, '') : undefined,
      timeCal: node.delayType === FlwEnums.NodeDelayType.CAL ? get(node, 'extendConfig.time') : undefined,
    })
  }

  const text = useMemo(() => {
    if (node.triggerType === FlwEnums.NodeTriggerType.IMMEDIATE) {
      return `立即执行`;
    }
    const time = get(node, 'extendConfig.time');
    if (node.delayType === FlwEnums.NodeDelayType.FIXED) {
      return `等待${time}`;
    } else if (node.delayType === FlwEnums.NodeDelayType.CAL) {
      return `至当天${time}后进入下一步`;
    }
    return time;
  }, [node])

  return (
    <div className="node-wrap">
      <div className="node-wrap-box start-node" onClick={showDrawer}>
        <div className="title">
          <FaIconPro icon="fa-solid fa-user-large" />
          <span>{node.nodeName}</span>
          <NodeCloseBtn onClick={() => delNode()} />
        </div>
        <div className="content">
          {text}
        </div>
      </div>

      <BaseDrawer
        open={open}
        onClose={() => hide()}
        title={(
          <Input value={node.nodeName} variant="filled" onChange={e => updateNodeProps(node, 'nodeName', e.target.value)} />
        )}
      >
        <Form form={form} layout="vertical" className="fa-flex-column fa-full" disabled={readOnly}
          onValuesChange={(cv, av) => {
            handleValuesChange(av)
          }}
        >
          <div style={{ marginBottom: 12 }}>触发方式</div>
          <div style={{ marginBottom: 12 }}>
            <Form.Item name="triggerType" noStyle>
              <Radio.Group
                options={[
                  { label: '立即执行', value: FlwEnums.NodeTriggerType.IMMEDIATE },
                  { label: '延迟执行', value: FlwEnums.NodeTriggerType.DELAY },
                ]}
              />
            </Form.Item>
          </div>

          {node.triggerType === FlwEnums.NodeTriggerType.DELAY && (
            <>
              <div style={{ marginBottom: 12 }}>延时时间</div>
              <div style={{ marginBottom: 12 }}>
                <Form.Item name="delayType" noStyle>
                  <Radio.Group
                    options={[
                      { label: '固定时长', value: FlwEnums.NodeDelayType.FIXED },
                      { label: '自动计算', value: FlwEnums.NodeDelayType.CAL },
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>
              </div>

              {node.delayType === FlwEnums.NodeDelayType.FIXED && (
                <Space.Compact className="fa-flex-row-center">
                  <Form.Item name="timeNum" noStyle>
                    <InputNumber min={0} />
                  </Form.Item>
                  <Form.Item name="timeType" noStyle>
                    <Select
                      options={[
                        { label: '天', value: 'd' },
                        { label: '小时', value: 'h' },
                        { label: '分钟', value: 'm' },
                      ]}
                      style={{width:80}}
                    />
                  </Form.Item>
                  <div className="fa-ml12">后进入下一步</div>
                </Space.Compact>
              )}

              {node.delayType === FlwEnums.NodeDelayType.CAL && (
                <div className="fa-flex-row-center">
                  <div className="fa-mr12">至当天</div>
                  <Form.Item name="timeCal" noStyle>
                    <TimePicker />
                  </Form.Item>
                  <div className="fa-ml12">后进入下一步</div>
                </div>
              )}
            </>
          )}

          <div style={{ marginBottom: 12 }}>执行参数</div>
          <div style={{ marginBottom: 12 }}>
            <Form.Item name="args" noStyle>
              <Input.TextArea placeholder="传递给trigger类的json格式参数" />
            </Form.Item>
          </div>

          <div style={{ marginBottom: 12 }}>执行Class</div>
          <div style={{ marginBottom: 12 }}>
            <Form.Item name="trigger" noStyle>
              <Input placeholder="必填项，接口TaskTrigger实现class；如果不配置，调用全局实现子类" />
            </Form.Item>
          </div>
        </Form>
      </BaseDrawer>

      <AddNode parentNode={node} />
    </div>
  )
}
