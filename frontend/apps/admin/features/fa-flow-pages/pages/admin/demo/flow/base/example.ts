export const DEMO_FLOW_CONFIG = {
  id: 1,
  name: '请假审批',
  key: 'k0001',
  nodeConfig: {
    nodeName: '发起人',
    nodeKey: 'flk0001',
    type: 0,
    nodeAssigneeList: [],
    childNode: {
      nodeName: '条件路由',
      nodeKey: 'flk00101',
      type: 4,
      conditionNodes: [
        {
          nodeName: '长期',
          nodeKey: 'flk1001',
          type: 3,
          priorityLevel: 1,
          conditionMode: 1,
          conditionList: [
            [
              {
                label: '请假天数',
                field: 'day',
                operator: '>',
                value: '7'
              }
            ]
          ],
          childNode: {
            nodeName: '领导审批',
            nodeKey: 'flk0002',
            type: 1,
            setType: 1,
            nodeAssigneeList: [
              {
                id: '360000197302144442',
                name: '何敏'
              }
            ],
            examineLevel: 1,
            directorLevel: 1,
            selectMode: 1,
            termAuto: false,
            term: 0,
            termMode: 1,
            examineMode: 1,
            directorMode: 0
          }
        },
        {
          nodeName: '短期',
          nodeKey: 'flk2001',
          type: 3,
          priorityLevel: 2,
          conditionMode: 1,
          conditionList: [],
          childNode: {
            nodeName: '直接主管审批',
            nodeKey: 'flk0003',
            type: 1,
            setType: 2,
            nodeAssigneeList: [],
            examineLevel: 1,
            directorLevel: 1,
            selectMode: 1,
            termAuto: false,
            term: 0,
            termMode: 1,
            examineMode: 1,
            directorMode: 0
          }
        }
      ],
      childNode: {
        nodeName: '抄送人',
        nodeKey: 'flk3001',
        type: 2,
        userSelectFlag: true,
        nodeAssigneeList: [
          {
            id: '220000200908305857',
            name: '何秀英'
          }
        ]
      }
    }
  }
}
