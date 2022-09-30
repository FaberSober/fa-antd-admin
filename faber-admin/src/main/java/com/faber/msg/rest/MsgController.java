package com.faber.msg.rest;

import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.rest.BaseController;
import com.faber.common.vo.query.QueryParams;
import com.faber.msg.biz.MsgBiz;
import com.faber.msg.entity.Msg;
import com.faber.msg.vo.MsgStatisticVO;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/msg")
public class MsgController extends BaseController<MsgBiz, Msg, Integer> {

    /**
     * 消息数量统计。
     * 1. 未读消息数量；
     */
    @RequestMapping(value = "/countMine", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<MsgStatisticVO> countMine() {
        MsgStatisticVO data = baseBiz.countMine();
        return ok(data);
    }

    /**
     * 分页查询
     */
    @RequestMapping(value = "/pageMine", method = RequestMethod.POST)
    @ResponseBody
    public TableResultResponse<Msg> pageMine(@RequestBody QueryParams query) {
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
    public ObjectRestResponse<Boolean> batchRead(@RequestBody List<Long> ids) {
        baseBiz.batchRead(ids);
        return ok();
    }

}