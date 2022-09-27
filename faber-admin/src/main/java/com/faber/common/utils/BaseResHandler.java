package com.faber.common.utils;

import com.faber.common.context.BaseContextHandler;
import com.faber.common.msg.ObjectRestResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BaseResHandler {

    public String getCurrentUserName() {
        return BaseContextHandler.getUsername();
    }

    public String getCurrentUserId() {
        return BaseContextHandler.getUserId();
    }

    protected <T> ObjectRestResponse<T> ok() {
        return new ObjectRestResponse<T>().rel(true);
    }

    protected <T> ObjectRestResponse<T> ok(T data) {
        return new ObjectRestResponse<T>().data(data);
    }

    protected ObjectRestResponse<List<Map<String, Object>>> okDatav(Object data) {
        Map<String, Object> map = new HashMap<>();
        map.put("value", data);

        List<Map<String, Object>> list = new ArrayList<>();
        list.add(map);
        return new ObjectRestResponse<List<Map<String, Object>>>().data(list);
    }
}
