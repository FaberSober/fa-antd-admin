package com.faber.api.base.msg.rest;

import com.faber.api.base.msg.biz.MsgBiz;
import com.faber.api.base.msg.entity.Msg;
import com.faber.api.base.msg.vo.MsgStatisticVO;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.vo.msg.Ret;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FaLogBiz("消息")
@RestController
@RequestMapping("/api/base/admin/msg")
public class MsgController extends BaseController<MsgBiz, Msg, Long> {

    /**
     * 消息数量统计。
     * 1. 未读消息数量；
     */
    @FaLogOpr("数量统计")
    @RequestMapping(value = "/countMine", method = RequestMethod.GET)
    @ResponseBody
    public Ret<MsgStatisticVO> countMine() {
        MsgStatisticVO data = baseBiz.countMine();
        return ok(data);
    }

    @FaLogOpr("个人分页查询")
    @RequestMapping(value = "/pageMine", method = RequestMethod.POST)
    @ResponseBody
    public TableRet<Msg> pageMine(@RequestBody QueryParams query) {
        query.getQuery().put("toUserId", getLoginUserId());
        return baseBiz.selectPageByQuery(query);
    }

    @FaLogOpr("批量已读")
    @RequestMapping(value = "/batchRead", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> batchRead(@RequestBody List<Long> ids) {
        baseBiz.batchRead(ids);
        return ok();
    }

    @FaLogOpr("全部已读")
    @RequestMapping(value = "/readAll", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Boolean> readAll() {
        baseBiz.readAll();
        return ok();
    }

}