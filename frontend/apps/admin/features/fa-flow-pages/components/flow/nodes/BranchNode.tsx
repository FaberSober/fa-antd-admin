import React, { ReactNode, useState } from 'react';
import { Flw } from "@features/fa-flow-pages/types";
import { NodeCloseBtn } from "@features/fa-flow-pages/components/flow/cubes";
import { Button, Form, Input, Select, Space } from "antd";
import { BaseDrawer, FaFlexRestLayout, FaArrUtils, useOpen } from "@fa/ui";
import { useConditionNode } from '../hooks';
import { DeleteOutlined, PlusOutlined, RollbackOutlined, SaveOutlined } from "@ant-design/icons";


export interface BranchNodeProps {
  node: Flw.ConditionNode;
  index: number;
  onDel?: () => void;
  conditionText: string | ReactNode;
  onSubmit?: (cn: Flw.ConditionNode) => void;
}

/**
 * BranchNode
 * TODO add drag sort branch condition
 * @author xu.pengfei
 * @date 2025/8/21 17:08
 */
export default function BranchNode({node, index, onDel, conditionText, onSubmit}: BranchNodeProps) {
  const [form] = Form.useForm();
  const [open, show, hide] = useOpen()
  const [loading, setLoading] = useState(false)

  const {nodeCopy, setNodeCopy, updateNodeProps} = useConditionNode(node)

  async function onFinish(fieldsValue: any) {
    try {
      setLoading(true)

      if (onSubmit) {
        onSubmit(nodeCopy)
      }

      setLoading(false)
      hide()
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  function showDrawer() {
    show()
    // form.setFieldsValue({
    //   ...nodeCopy,
    // })
  }

  return (
    <>
      <div className="fa-flex-column" onClick={showDrawer}>
        <div className="title">
          <span className="node-title">{node.nodeName}</span>
          <span className="priority-title">优先级{node.priorityLevel}</span>
          <NodeCloseBtn onClick={onDel}/>
        </div>

        <div className="content">
          {conditionText ? <span>{conditionText}</span> : <span className="placeholder">请设置条件</span>}
        </div>
      </div>

      <BaseDrawer
        open={open}
        onClose={() => hide()}
        title={(
          <Input value={nodeCopy.nodeName} variant="filled" onChange={e => updateNodeProps('nodeName', e.target.value)}/>
        )}
      >
        <Form
          form={form}
          layout="vertical"
          className="fa-flex-column fa-full"
          onFinish={onFinish}
        >
          <FaFlexRestLayout>
            <div className="fa-flex-column">
              <div className="top-tips">满足以下条件时进入当前分支</div>

              {nodeCopy.conditionList!.map((conditionGroup, conditionGroupIdx) => {
                return (
                  <div key={conditionGroupIdx}>
                    {conditionGroupIdx !== 0 && <div className="or-branch-link-tip">或满足</div>}

                    <div className="condition-group-editor">
                      <div className="header">
                        <span>条件组 {conditionGroupIdx + 1}</span>

                        <div
                          onClick={() => {
                            updateNodeProps(`conditionList`, FaArrUtils.spliceAndReturnSelf(nodeCopy.conditionList!, conditionGroupIdx))
                          }}
                          className="fa-normal-btn">
                          <DeleteOutlined/>
                        </div>
                      </div>

                      <div className="main-content">
                        {/* 表头：单个条件 */}
                        <div className="fa-flex-row cell-box">
                          <div style={{width: 60}} />
                          <div className="fa-flex-1">描述</div>
                          <div className="fa-flex-1">条件字段</div>
                          <div className="fa-flex-1">运算符</div>
                          <div className="fa-flex-1">值</div>
                          <div style={{width: 60}} />
                        </div>

                        {conditionGroup.map((condition, idx) => {
                          return (
                            <div key={idx} className="condition-content">
                              <div className="fa-flex-row" style={{ gap: 8 }}>
                                <div style={{width: 60}} className="fa-flex-center">{idx === 0 ? '当' : '且'}</div>
                                <Input style={{flex: 1}} value={condition.label} placeholder="描述" onChange={e => {
                                  updateNodeProps(`conditionList.[${conditionGroupIdx}].[${idx}].label`, e.target.value)
                                }} />
                                <Input style={{flex: 1}} value={condition.field} placeholder="条件字段" onChange={e => {
                                  updateNodeProps(`conditionList.[${conditionGroupIdx}].[${idx}].field`, e.target.value)
                                }} />
                                <Select
                                  style={{flex: 1}}
                                  value={condition.operator}
                                  onChange={(v) => updateNodeProps(`conditionList.[${conditionGroupIdx}].[${idx}].operator`, v)}
                                  options={[
                                    {value: '==', label: '等于'},
                                    {value: '!=', label: '不等于'},
                                    {value: '>', label: '大于'},
                                    {value: '>=', label: '大于等于'},
                                    {value: '<', label: '小于'},
                                    {value: '<=', label: '小于等于'},
                                    {value: 'include', label: '包含'},
                                    {value: 'notinclude', label: '不包含'},
                                  ]}
                                  placeholder="运算符"
                                />
                                <Input style={{flex: 1}} value={condition.value} placeholder="值" onChange={e => {
                                  updateNodeProps(`conditionList.[${conditionGroupIdx}].[${idx}].value`, e.target.value)
                                }} />

                                <div style={{width: 60}} className="fa-flex-center">
                                  <div
                                    onClick={() => {
                                      updateNodeProps(`conditionList.[${conditionGroupIdx}]`, FaArrUtils.spliceAndReturnSelf(conditionGroup, idx))
                                    }}
                                    className="fa-normal-btn"
                                  >
                                    <DeleteOutlined />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="sub-content">
                        <Button
                          onClick={() => {
                            updateNodeProps(`conditionList.[${conditionGroupIdx}]`, [...conditionGroup, {
                              label: '',
                              field: '',
                              operator: '',
                              value: '',
                            }])
                          }}
                          type="link"
                          icon={<PlusOutlined/>}
                        >添加条件</Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              <Button
                onClick={() => {
                  updateNodeProps('conditionList', [...nodeCopy.conditionList!, [{
                    label: '',
                    field: '',
                    operator: '',
                    value: '',
                  }]])
                }}
                icon={<PlusOutlined/>} block variant="filled" color="default">添加条件组</Button>
            </div>

          </FaFlexRestLayout>

          <Space>
            <Button type="primary" icon={<SaveOutlined/>} htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={() => hide()} icon={<RollbackOutlined/>}>取消</Button>
          </Space>
        </Form>
      </BaseDrawer>
    </>
  )
}
