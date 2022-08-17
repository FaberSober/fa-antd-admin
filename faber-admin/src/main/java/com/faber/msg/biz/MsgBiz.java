package com.faber.msg.biz;

import cn.hutool.core.bean.BeanUtil;
import com.faber.msg.entity.Msg;
import com.faber.msg.vo.MsgPageVo;
import com.faber.msg.vo.MsgStatisticVO;
import com.faber.admin.biz.DictBiz;
import com.faber.admin.biz.UserBiz;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.bean.BaseOprEntity;
import com.faber.common.biz.BaseBiz;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.util.Query;
import com.faber.msg.mapper.MsgMapper;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

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
        MsgStatisticVO vo = new MsgStatisticVO();

        // 1. 未读消息数量；
        Example example = new Example(Msg.class);
        example.createCriteria()
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("toUserId", getCurrentUserId())
                .andEqualTo("isRead", BaseOprEntity.Bool.FALSE);
        int unreadCount = mapper.selectCountByExample(example);
        vo.setUnreadCount(unreadCount);

        return vo;
    }

    /**
     * 消息批量已读
     * @param params
     */
    public void batchRead(Map<String, Object> params) {
        List<Integer> ids = (List<Integer>) params.get("ids");

        Example example = new Example(Msg.class);
        example.createCriteria().andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andIn("id", ids);
        List<Msg> msgList = mapper.selectByExample(example);
        Date now = new Date();
        msgList.forEach(msg -> {
            msg.setIsRead(BaseOprEntity.Bool.TRUE);
            msg.setReadTime(now);
            this.updateSelectiveById(msg);
        });
    }

    public void sendMsg(String fromUserId, String toUserId, String content) {
        Msg bean = new Msg();
        bean.setFromUserId(fromUserId);
        bean.setToUserId(toUserId);
        bean.setContent(content);
        bean.setIsRead(BaseOprEntity.Bool.FALSE);

        this.insertSelective(bean);
    }

    @Override
    public TableResultResponse<Msg> selectPageByQuery(Query query) {
        TableResultResponse<Msg> table = super.selectPageByQuery(query);
        List<Msg> list = new ArrayList<>();
        table.getData().getRows().forEach(bean -> {
            MsgPageVo vo = new MsgPageVo();
            BeanUtil.copyProperties(bean, vo);

            vo.setBuzzName(Msg.BuzzType.valueOf(bean.getBuzzType()).getDesc());

            vo.setFromUser(userBiz.findUserInfoById(vo.getFromUserId()));
            vo.setToUser(userBiz.findUserInfoById(vo.getToUserId()));
            list.add(vo);
        });
        table.getData().setRows(list);
        // 添加字典值
        table.getData()
                .addDict("isRead", dictBiz.getByCode("common.enum.true_or_false"))
                .addDict("buzzType", dictBiz.getByCode("common.msg.buzz_type"));
        return table;
    }

}
