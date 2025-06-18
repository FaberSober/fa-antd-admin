package com.faber.core.config.socket.vo;

import cn.hutool.json.JSONObject;
import com.alibaba.fastjson2.JSON;
import com.faber.core.config.socket.enums.SocketMsgActEnum;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * websocket交互数据类型
 *
 * @Author: xu.pengfei
 * @Email: faberxu@gmail.com
 * @Date: 2018-11-07 11:14
 */
@Data
@Builder
@EqualsAndHashCode
public class BaseSocketMsg implements Serializable {

    /**
     * 操作类型
     */
    private String act;

    private Object data;

    public static BaseSocketMsg link(String label, String link) {
        JSONObject jo = new JSONObject();
        jo.put("label", label);
        jo.put("link", link);
        return BaseSocketMsg.builder().act(SocketMsgActEnum.LINK.getValue()).data(jo).build();
    }

    public static BaseSocketMsg linkImg(String label, String link) {
        JSONObject jo = new JSONObject();
        jo.put("label", label);
        jo.put("link", link);
        return BaseSocketMsg.builder().act(SocketMsgActEnum.LINK_IMG.getValue()).data(jo).build();
    }

    public static BaseSocketMsg linkVideo(String label, String link) {
        JSONObject jo = new JSONObject();
        jo.put("label", label);
        jo.put("link", link);
        return BaseSocketMsg.builder().act(SocketMsgActEnum.LINK_VIDEO.getValue()).data(jo).build();
    }

    public static BaseSocketMsg text(String msg) {
        return BaseSocketMsg.builder().act(SocketMsgActEnum.TEXT.getValue()).data(msg).build();
    }

    public static BaseSocketMsg json(JSONObject data) {
        return BaseSocketMsg.builder().act(SocketMsgActEnum.JSON.getValue()).data(data).build();
    }

    public static BaseSocketMsg act(SocketMsgActEnum act, Object data) {
        return BaseSocketMsg.builder().act(act.getValue()).data(data).build();
    }

    public static BaseSocketMsg act(String act, Object data) {
        return BaseSocketMsg.builder().act(act).data(data).build();
    }

    public static BaseSocketMsg operationDone() {
        return BaseSocketMsg.builder().act(SocketMsgActEnum.OPERATION_DONE.getValue()).data("").build();
    }

    public String toJSONString() {
        return JSON.toJSONString(this);
    }

}
