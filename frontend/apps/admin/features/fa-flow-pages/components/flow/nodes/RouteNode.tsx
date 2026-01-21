import { Flw } from '@/types';
import { Button, Input, Select, TreeSelect } from 'antd';
import { cloneDeep, set } from 'lodash';
import { useNodeTreeData } from '../hooks';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FaArrUtils } from '@fa/ui';

export interface RouteNodeProps {
  routeNode: Flw.ConditionNode;
  onDel?: () => void;
  onChange?: (node: Flw.ConditionNode) => void;
}

/**
 * @author xu.pengfei
 * @date 2026-01-21 11:15:20
 */
export default function RouteNode({ routeNode, onDel, onChange }: RouteNodeProps) {
  const {treeData} = useNodeTreeData();

  function handleChange(props: any, value: any) {
    const newNode = cloneDeep(routeNode);
    set(newNode, props, value);
    onChange?.(newNode);
  }

  function handleAddCond() {
    const newNode = cloneDeep(routeNode);
    newNode.conditionList = newNode.conditionList || [];
    newNode.conditionList.push([]);
    onChange?.(newNode);
  }

  return (
    <div className='fa-border fa-radius fa-flex-column fa-p0'>
      <div className='fa-p12 fa-flex-row-center fa-border-b fa-gap12'>
        <div>
          <Input
            value={routeNode.nodeName}
            onChange={e => handleChange('nodeName', e.target.value)}
            variant='underlined'
          />
        </div>
        <TreeSelect
          style={{ minWidth: 170 }}
          treeData={treeData}
          treeDefaultExpandAll
          value={routeNode.nodeKey}
          onChange={v => handleChange('nodeKey', v)}
        />
        <div className='fa-flex-1' />
        <Button onClick={onDel} size='small' type='text' danger>删除</Button>
      </div>

      <div className='fa-flex-column fa-gap12 fa-p12'>
        {routeNode.conditionList && routeNode.conditionList.map((conditionGroup, conditionGroupIdx) => {
          return (
            <div key={conditionGroupIdx}>
              {conditionGroupIdx !== 0 && <div className="or-branch-link-tip">或满足</div>}

              <div className="condition-group-editor">
                <div className="header">
                  <span>条件组 {conditionGroupIdx + 1}</span>

                  <div
                    onClick={() => {
                      handleChange('conditionList', FaArrUtils.spliceAndReturnSelf([...routeNode.conditionList!], conditionGroupIdx))
                    }}
                    className="fa-normal-btn fa-branch-cond-group-del">
                    <DeleteOutlined />
                  </div>
                </div>

                <div className="main-content">
                  {/* 表头：单个条件 */}
                  <div className="fa-flex-row cell-box">
                    <div style={{ width: 60 }} />
                    <div className="fa-flex-1">描述</div>
                    <div className="fa-flex-1">条件字段</div>
                    <div className="fa-flex-1">运算符</div>
                    <div className="fa-flex-1">值</div>
                    <div style={{ width: 60 }} />
                  </div>

                  {conditionGroup.map((condition, idx) => {
                    return (
                      <div key={idx} className="condition-content">
                        <div className="fa-flex-row" style={{ gap: 8 }}>
                          <div style={{ width: 60 }} className="fa-flex-center">{idx === 0 ? '当' : '且'}</div>
                          <Input style={{ flex: 1 }} value={condition.label} placeholder="描述" onChange={e => {
                            handleChange(`conditionList[${conditionGroupIdx}][${idx}].label`, e.target.value)
                          }} />
                          <Input style={{ flex: 1 }} value={condition.field} placeholder="条件字段" onChange={e => {
                            handleChange(`conditionList[${conditionGroupIdx}][${idx}].field`, e.target.value)
                          }} />
                          <Select
                            style={{ flex: 1 }}
                            value={condition.operator}
                            onChange={(v) => handleChange(`conditionList[${conditionGroupIdx}][${idx}].operator`, v)}
                            options={[
                              { value: '==', label: '等于' },
                              { value: '!=', label: '不等于' },
                              { value: '>', label: '大于' },
                              { value: '>=', label: '大于等于' },
                              { value: '<', label: '小于' },
                              { value: '<=', label: '小于等于' },
                              { value: 'include', label: '包含' },
                              { value: 'notinclude', label: '不包含' },
                            ]}
                            placeholder="运算符"
                          />
                          <Input style={{ flex: 1 }} value={condition.value} placeholder="值" onChange={e => {
                            handleChange(`conditionList[${conditionGroupIdx}][${idx}].value`, e.target.value)
                          }} />

                          <div style={{ width: 60 }} className="fa-flex-center">
                            <div
                              onClick={() => {
                                handleChange(`conditionList[${conditionGroupIdx}]`, FaArrUtils.spliceAndReturnSelf([...conditionGroup], idx))
                              }}
                              className="fa-normal-btn fa-branch-cond-del-btn"
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
                      handleChange(`conditionList[${conditionGroupIdx}]`, [...conditionGroup, {
                        label: '',
                        field: '',
                        operator: '',
                        value: '',
                      }])
                    }}
                    type="link"
                    icon={<PlusOutlined />}
                    className='fa-branch-add-cond-btn'
                  >添加条件</Button>
                </div>
              </div>
            </div>
          )
        })}
        <Button onClick={handleAddCond} icon={<PlusOutlined />}>添加条件组</Button>
      </div>
    </div>
  );
}
