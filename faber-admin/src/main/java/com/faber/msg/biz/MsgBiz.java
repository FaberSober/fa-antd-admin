package com.faber.msg.biz;

import com.faber.admin.biz.DictBiz;
import com.faber.admin.biz.UserBiz;
import com.faber.common.biz.BaseBiz;
import com.faber.common.enums.BoolEnum;
import com.faber.msg.entity.Msg;
import com.faber.msg.mapper.MsgMapper;
import com.faber.msg.vo.MsgStatisticVO;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * 系统-消息
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-13 21:19:53
 */
@Service
public class MsgBiz extends BaseBiz<MsgMapper, Msg> {

    @Resource
    private DictBiz dictBiz;

    @Resource
    private UserBiz userBiz;

    /**
     * 消息数量统计。
     * 1. 未读消息数量；
     */
    public MsgStatisticVO countMine() {
        // 1. 未读消息数量
        long unreadCount = lambdaQuery()
                .eq(Msg::getToUserId, getCurrentUserId())
                .eq(Msg::getIsRead, BoolEnum.NO)
                .count();

        MsgStatisticVO vo = new MsgStatisticVO();
        vo.setUnreadCount(unreadCount);
        return vo;
    }

    /**
     * 消息批量已读
     * @param ids
     */
    public void batchRead(List<Long> ids) {

        Date now = new Date();
        lambdaUpdate()
                .in(Msg::getId, ids)
                .set(Msg::getIsRead, BoolEnum.YES)
                .set(Msg::getReadTime, now)
                .update();
    }

    public void sendMsg(String fromUserId, String toUserId, String content) {
        Msg bean = new Msg();
        bean.setFromUserId(fromUserId);
        bean.setToUserId(toUserId);
        bean.setContent(content);
        bean.setIsRead(BoolEnum.YES);

        this.save(bean);
    }

}
