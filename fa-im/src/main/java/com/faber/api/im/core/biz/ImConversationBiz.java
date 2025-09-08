package com.faber.api.im.core.biz;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.faber.api.im.core.entity.ImConversation;
import com.faber.api.im.core.entity.ImParticipant;
import com.faber.api.im.core.enums.ImConversationTypeEnum;
import com.faber.api.im.core.mapper.ImConversationMapper;
import com.faber.api.im.core.vo.req.ImConversationCreateNewSingleReqVo;
import com.faber.core.web.biz.BaseBiz;

import jakarta.annotation.Resource;

/**
 * IM-会话表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-09-07 21:51:31
 */
@Service
public class ImConversationBiz extends BaseBiz<ImConversationMapper,ImConversation> {

    @Resource ImParticipantBiz imParticipantBiz;

    /**
     * 创建新的单聊会话
     * 1. 根据单聊对方用户ID查询是否已经存在聊天，如果存在，则直接返回；
     * 2. 如果不存在，则创建新的聊天，然后返回；
     * @param reqVo
     * @return
     */
    @Transactional
    public ImConversation createNewSingle(ImConversationCreateNewSingleReqVo reqVo) {
        LambdaQueryChainWrapper<ImConversation> wrapper = lambdaQuery()
            .eq(ImConversation::getCrtUser, getCurrentUserId())
            .eq(ImConversation::getToUserId, reqVo.getToUserId())
            .eq(ImConversation::getType, ImConversationTypeEnum.SINGLE);
        long count = wrapper.count();
        if (count > 0) {
            return getTop(wrapper.orderByDesc(ImConversation::getId));
        }

        // create new conversation
        ImConversation conversation = new ImConversation();
        conversation.setToUserId(reqVo.getToUserId());
        conversation.setType(ImConversationTypeEnum.SINGLE);
        this.save(conversation);

        // save conversation user link
        {
            ImParticipant participantCrt = new ImParticipant();
            participantCrt.setConversationId(conversation.getId());
            participantCrt.setUserId(getCurrentUserId());
            imParticipantBiz.save(participantCrt);
        }
        {
            ImParticipant participantTo = new ImParticipant();
            participantTo.setConversationId(conversation.getId());
            participantTo.setUserId(reqVo.getToUserId());
            imParticipantBiz.save(participantTo);
        }

        return conversation;
    }

}