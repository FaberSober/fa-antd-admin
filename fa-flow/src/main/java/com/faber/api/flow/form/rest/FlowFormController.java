package com.faber.api.flow.form.rest;

import java.sql.SQLException;
import java.util.Map;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.faber.api.flow.form.biz.FlowFormBiz;
import com.faber.api.flow.form.entity.FlowForm;
import com.faber.api.flow.form.vo.req.CreateColumnReqVo;
import com.faber.api.flow.form.vo.req.CreateFormTableReqVo;
import com.faber.api.flow.form.vo.req.DeleteColumnReqVo;
import com.faber.api.flow.form.vo.ret.TableInfoVo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;

import cn.hutool.core.map.MapUtil;

/**
 * FLOW-流程表单
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-12-16 15:43:41
 */
@FaLogBiz("FLOW-流程表单")
@RestController
@RequestMapping("/api/flow/form/flowForm")
public class FlowFormController extends BaseController<FlowFormBiz, FlowForm, Integer> {

    
    @FaLogOpr(value = "新增主表", crud = LogCrudEnum.C)
    @RequestMapping(value = "/createFormTable", method = RequestMethod.POST)
    @ResponseBody
    public Ret<CreateFormTableReqVo> createFormTable(@Validated @RequestBody CreateFormTableReqVo reqVo) throws SQLException {
        baseBiz.createFormTable(reqVo);
        return ok(reqVo);
    }

    @FaLogOpr(value = "查询表结构", crud = LogCrudEnum.C)
    @RequestMapping(value = "/queryTableStructure", method = RequestMethod.POST)
    @ResponseBody
    public Ret<TableInfoVo> queryTableStructure(@RequestBody Map<String, Object> reqVo) throws SQLException {
        String tableName = MapUtil.getStr(reqVo, "tableName");
        TableInfoVo data = baseBiz.queryTableStructure(tableName);
        return ok(data);
    }

    @FaLogOpr(value = "新建列", crud = LogCrudEnum.C)
    @RequestMapping(value = "/createColumn", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> createColumn(@RequestBody CreateColumnReqVo reqVo) throws SQLException {
        baseBiz.createColumn(reqVo);
        return ok();
    }

    @FaLogOpr(value = "更新列", crud = LogCrudEnum.C)
    @RequestMapping(value = "/updateColumn", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateColumn(@RequestBody CreateColumnReqVo reqVo) throws SQLException {
        baseBiz.updateColumn(reqVo);
        return ok();
    }

    @FaLogOpr(value = "删除列", crud = LogCrudEnum.C)
    @RequestMapping(value = "/deleteColumn", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> deleteColumn(@RequestBody DeleteColumnReqVo reqVo) throws SQLException {
        baseBiz.deleteColumn(reqVo);
        return ok();
    }

}