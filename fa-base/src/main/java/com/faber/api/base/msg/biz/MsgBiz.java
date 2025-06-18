package com.faber.api.base.msg.biz;

import com.faber.api.base.admin.biz.UserBiz;
import com.faber.api.base.admin.entity.User;
import com.faber.api.base.msg.entity.Msg;
import com.faber.api.base.msg.mapper.MsgMapper;
import com.faber.api.base.msg.vo.MsgStatisticVO;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
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
    UserBiz userBiz;

    @Override
    public void decorateOne(Msg i) {
        User fromUser = userBiz.getByIdWithCache(i.getFromUserId());
        if (fromUser!= null) {
            i.setFromUserName(fromUser.getName());
        }
        i.setFromUser(fromUser);
    }

    /**
     * 消息数量统计。
     * 1. 未读消息数量；
     */
    public MsgStatisticVO countMine() {
        // 1. 未读消息数量
        long unreadCount = lambdaQuery()
                .eq(Msg::getToUserId, getCurrentUserId())
                .eq(Msg::getIsRead, false)
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
                .eq(Msg::getToUserId, getCurrentUserId())
                .set(Msg::getIsRead, true)
                .set(Msg::getReadTime, now)
                .update();
    }

    /**
     * 全部已读
     */
    public void readAll() {
        Date now = new Date();
        lambdaUpdate()
                .eq(Msg::getToUserId, getCurrentUserId())
                .ne(Msg::getIsRead, true)
                .set(Msg::getIsRead, true)
                .set(Msg::getReadTime, now)
                .update();
    }

    public void sendMsg(String fromUserId, String toUserId, String content) {
        Msg bean = new Msg();
        bean.setFromUserId(fromUserId);
        bean.setToUserId(toUserId);
        bean.setContent(content);
        bean.setIsRead(true);

        this.save(bean);
    }

}
