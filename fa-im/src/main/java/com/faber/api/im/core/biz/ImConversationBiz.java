package com.faber.api.im.core.biz;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.faber.api.base.admin.biz.UserBiz;
import com.faber.api.base.admin.entity.User;
import com.faber.api.im.core.entity.ImConversation;
import com.faber.api.im.core.entity.ImMessage;
import com.faber.api.im.core.entity.ImParticipant;
import com.faber.api.im.core.enums.ImConversationTypeEnum;
import com.faber.api.im.core.mapper.ImConversationMapper;
import com.faber.api.im.core.vo.req.ImConversationCreateNewSingleReqVo;
import com.faber.api.im.core.vo.req.ImConversationListQueryReqVo;
import com.faber.api.im.core.vo.req.ImConversationSendMsgReqVo;
import com.faber.api.im.core.vo.ret.ImConversationRetVo;
import com.faber.config.websocket.WsHolder;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.enums.WsTypeEnum;
import com.faber.core.web.biz.BaseBiz;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
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

    @Resource UserBiz userBiz;
    @Resource ImParticipantBiz imParticipantBiz;
    @Resource ImMessageBiz imMessageBiz;
    @Resource ImMessageReadBiz imMessageReadBiz;

    /**
     * 创建新的单聊会话
     * 1. 根据单聊对方用户ID查询是否已经存在聊天，如果存在，则直接返回；
     * 2. 如果不存在，则创建新的聊天，然后返回；
     * @param reqVo
     * @return
     */
    @Transactional
    public ImConversation createNewSingle(ImConversationCreateNewSingleReqVo reqVo) {
        // 将参考单聊的用户IDs进行排序，然后转换为jsonarray
        List<String> userIds = Arrays.asList(getCurrentUserId(), reqVo.getToUserId());
        Collections.sort(userIds);
        JSONArray userIdArray = new JSONArray(userIds);
        String userIdsStr = userIdArray.toString();

        LambdaQueryChainWrapper<ImConversation> wrapper = lambdaQuery()
            .eq(ImConversation::getUserIds, userIdsStr)
            .eq(ImConversation::getType, ImConversationTypeEnum.SINGLE);
        long count = wrapper.count();
        if (count > 0) {
            return getTop(wrapper.orderByDesc(ImConversation::getId));
        }

        User toUser = userBiz.getById(reqVo.getToUserId());

        // 聊天封面图片，为参加聊天的用户头像数组
        JSONArray imgArr = new JSONArray();
        List<User> userList = userBiz.lambdaQuery()
            .in(User::getId, Arrays.asList(getCurrentUserId(), reqVo.getToUserId()))
            .orderByAsc(User::getId)
            .select(User::getId, User::getImg)
            .list();
        for (User user : userList) {
            JSONObject userJson = new JSONObject();
            userJson.set("id", user.getId());
            userJson.set("img", user.getImg());
            imgArr.add(userJson);
        }

        // create new conversation
        ImConversation conversation = new ImConversation();
        conversation.setUserIds(userIdsStr);
        conversation.setType(ImConversationTypeEnum.SINGLE);
        conversation.setTitle("单聊");
        conversation.setCover(imgArr.toString());
        this.save(conversation);

        // save conversation user link
        {
            ImParticipant participantCrt = new ImParticipant();
            participantCrt.setConversationId(conversation.getId());
            participantCrt.setUserId(getCurrentUserId());
            participantCrt.setTitle(toUser.getName()); // 存对方的名称
            participantCrt.setUnreadCount(0);
            imParticipantBiz.save(participantCrt);
        }
        {
            ImParticipant participantTo = new ImParticipant();
            participantTo.setConversationId(conversation.getId());
            participantTo.setUserId(reqVo.getToUserId());
            participantTo.setTitle(BaseContextHandler.getName()); // 存对方的名称
            participantTo.setUnreadCount(0);
            imParticipantBiz.save(participantTo);
        }

        return conversation;
    }

    /**
     * 查询聊天记录
     * 
     * @param reqVo
     * @return
     */
    public List<ImConversationRetVo> listQuery(ImConversationListQueryReqVo reqVo) {
        // 查询用户参加的聊天记录
        List<ImConversationRetVo> convList = baseMapper.listQuery(getCurrentUserId(), reqVo);
        return convList;
    }

    /**
     * 发送消息
     * @param reqVo
     * @return
     */
    public ImMessage sendMsg(ImConversationSendMsgReqVo reqVo) {
        // create new message
        ImMessage msg = new ImMessage();
        msg.setConversationId(reqVo.getConversationId());
        msg.setSenderId(getCurrentUserId());
        msg.setType(reqVo.getType());
        msg.setContent(reqVo.getContent());
        msg.setIsWithdrawn(false);
        imMessageBiz.save(msg);

        // update conversation last message，超过250个字符截断
        String lastMsg = BaseContextHandler.getName() + ":" + reqVo.getContent();
        // 如果lastMsg超过250个字符，则截断
        if (lastMsg.length() > 250) {
            lastMsg = lastMsg.substring(0, 250);
        }
        this.lambdaUpdate()
            .eq(ImConversation::getId, reqVo.getConversationId())
            .set(ImConversation::getLastMsg, lastMsg)
            .update();

        // get conversation participants
        List<ImParticipant> convList = imParticipantBiz.lambdaQuery()
            .eq(ImParticipant::getConversationId, reqVo.getConversationId())
            .list();
        // get userIds except senderId
        List<String> userIds = convList.stream().map(ImParticipant::getUserId).filter(userId -> !userId.equals(getCurrentUserId())).toList();

        // send message throw websocket
        msg.setSenderUserImg(userBiz.getLoginUser().getImg());
        WsHolder.sendMessage(userIds, WsTypeEnum.IM, msg);

        return msg;
    }

    /**
     * 更新聊天已读
     * @param reqVo
     */
    public void updateConversationRead(String userId, Long conversationId) {
        // 查询最新的消息
        ImMessage lastMsg = imMessageBiz.lambdaQuery()
            .eq(ImMessage::getConversationId, conversationId)
            .orderByDesc(ImMessage::getId)
            .last("limit 1")
            .one();
        Long lastReadMessageId = lastMsg == null ? null : lastMsg.getId();

        // 更新用户关联的聊天记录已读数量为0
        imParticipantBiz.lambdaUpdate()
            .eq(ImParticipant::getConversationId, conversationId)
            .eq(ImParticipant::getUserId, userId)
            .set(ImParticipant::getUnreadCount, 0)
            .set(ImParticipant::getLastReadMessageId, lastReadMessageId)
            .update();
    }

    public Integer getUnreadCount() {
        return baseMapper.countUnreadByUserId(getCurrentUserId());
    }

}