package com.faber.api.flow.manage.biz;

import org.springframework.stereotype.Service;

import com.faber.api.flow.manage.entity.FlowProcess;
import com.faber.api.flow.manage.mapper.FlowProcessMapper;
import com.faber.core.web.biz.BaseBiz;

/**
 * FLOW-流程定义
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-23 14:10:49
 */
@Service
public class FlowProcessBiz extends BaseBiz<FlowProcessMapper,FlowProcess> {

  @Override
  public boolean save(FlowProcess entity) {
    // set default modelContent
    entity.setModelContent("""
      {
        "key": "autoSkip",
        "name": "自动跳过审批",
        "nodeConfig": {
          "nodeName": "发起人",
          "nodeKey": "flk1725161262899",
          "type": 0,
          "childNode": {
            "nodeName": "审核人",
            "nodeKey": "flk1724860316169",
            "callProcess": null,
            "type": 1,
            "setType": 3,
            "nodeAssigneeList": [
              {
                "id": "1",
                "name": "超级管理员"
              }
            ],
            "examineLevel": 1,
            "directorLevel": 1,
            "selectMode": 1,
            "termAuto": false,
            "term": 0,
            "termMode": 1,
            "examineMode": 2,
            "directorMode": 0,
            "typeOfApprove": 1,
            "remind": false,
            "approveSelf": 1
          }
        }
      }
    """);

    return super.save(entity);
  }

}