package com.faber.buzz.msg.rest;

import com.faber.common.vo.msg.Ret;
import com.faber.common.vo.msg.TableRet;
import com.faber.common.web.rest.BaseController;
import com.faber.common.vo.query.QueryParams;
import com.faber.buzz.msg.biz.MsgBiz;
import com.faber.buzz.msg.entity.Msg;
import com.faber.buzz.msg.vo.MsgStatisticVO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/msg")
public class MsgController extends BaseController<MsgBiz, Msg, Long> {

    /**
     * 消息数量统计。
     * 1. 未读消息数量；
     */
    @RequestMapping(value = "/countMine", method = RequestMethod.GET)
    @ResponseBody
    public Ret<MsgStatisticVO> countMine() {
        MsgStatisticVO data = baseBiz.countMine();
        return ok(data);
    }

    /**
     * 分页查询
     */
    @RequestMapping(value = "/pageMine", method = RequestMethod.POST)
    @ResponseBody
    public TableRet<Msg> pageMine(@RequestBody QueryParams query) {
        query.getQueryMap().put("toUserId", getCurrentUserId());
        return baseBiz.selectPageByQuery(query);
    }


    /**
     * 批量已读
     * @param ids
     * @return
     */
    @RequestMapping(value = "/batchRead", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> batchRead(@RequestBody List<Long> ids) {
        baseBiz.batchRead(ids);
        return ok();
    }

}