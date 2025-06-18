package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.Notice;
import com.faber.api.base.admin.entity.User;
import com.faber.api.base.admin.mapper.NoticeMapper;
import com.faber.api.base.msg.helper.MsgHelper;
import com.faber.api.base.msg.helper.config.MsgSendSysConfig;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;

/**
 * BASE-通知与公告
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2021-01-07 09:37:36
 */
@Service
public class NoticeBiz extends BaseBiz<NoticeMapper, Notice> {

    @Resource
    private UserBiz userBiz;

    @Resource
    private MsgHelper msgHelper;

    @Autowired
    private Executor executor;

    @Override
    protected void afterSave(Notice entity) {
        // 同步发送消息给所有人
        Map<String, Object> holdMap = BaseContextHandler.getHoldMap();
        executor.execute(() -> {
            // 线程中执行
            BaseContextHandler.setHoldMap(holdMap);

            List<String> userIds = userBiz.lambdaQuery().select(User::getId).list()
                            .stream().map(i -> i.getId())
                            .collect(Collectors.toList());

            MsgSendSysConfig config = MsgSendSysConfig.builder()
                    .buzzId(entity.getId() + "")
                    .content(entity.getTitle() + ": " + entity.getContent())
                    .build();
            msgHelper.sendSysMsg(getCurrentUserId(), userIds.toArray(new String[]{}), config);
        });
    }

}