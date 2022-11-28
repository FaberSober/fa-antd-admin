package com.faber.core.socket;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
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
public class Msg implements Serializable {

    public static final class Act {
        /**
         * simple show text
         */
        public static final String TEXT = "TEXT";
        /**
         * simple show text with link
         */
        public static final String LINK = "LINK";
        /**
         * simple show text and img with link
         */
        public static final String LINK_IMG = "LINK_IMG";
        /**
         * simple show text and video with link
         */
        public static final String LINK_VIDEO = "LINK_VIDEO";
        /**
         * json格式数据
         */
        public static final String JSON = "JSON";
        /**
         * 当前操作结束
         */
        public static final String OPERATION_DONE = "OPERATION_DONE";
        /**
         * online-站内ws消息
         */
        public static final String ONLINE_MSG = "ONLINE_MSG";
    }

    /**
     * 操作类型
     */
    private String act;

    private Object data;

    public static String link(String label, String link) {
        JSONObject jo = new JSONObject();
        jo.put("label", label);
        jo.put("link", link);
        return Msg.builder().act(Act.LINK).data(jo).build().toJSONString();
    }

    public static String linkImg(String label, String link) {
        JSONObject jo = new JSONObject();
        jo.put("label", label);
        jo.put("link", link);
        return Msg.builder().act(Act.LINK_IMG).data(jo).build().toJSONString();
    }

    public static String linkVideo(String label, String link) {
        JSONObject jo = new JSONObject();
        jo.put("label", label);
        jo.put("link", link);
        return Msg.builder().act(Act.LINK_VIDEO).data(jo).build().toJSONString();
    }

    public static String text(String msg) {
        return Msg.builder().act(Act.TEXT).data(msg).build().toJSONString();
    }

    public static String json(JSONObject data) {
        return Msg.builder().act(Act.JSON).data(data).build().toJSONString();
    }

    public static String act(String act, Object data) {
        return Msg.builder().act(act).data(data).build().toJSONString();
    }

    public static String operationDone() {
        return Msg.builder().act(Act.OPERATION_DONE).data("").build().toJSONString();
    }

    public String toJSONString() {
        return JSON.toJSONString(this);
    }

}
