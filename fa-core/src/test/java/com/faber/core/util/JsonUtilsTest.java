package com.faber.core.util;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

public class JsonUtilsTest {

    @Test
    public void testListToJsonArray() {
        List<Foo> list = new ArrayList<>();
        list.add(new Foo("bar1"));
        list.add(new Foo("bar2"));
        list.add(new Foo("bar3"));

        JSONArray array = JSONUtil.parseArray(list);
        System.out.println(array.toString());
    }

    @Test
    public void testJsonArrayToList() {
        JSONArray array = JSONUtil.parseArray("[{\"name\":\"bar1\"},{\"name\":\"bar2\"},{\"name\":\"bar3\"}]");

        List<Foo> list = JSONUtil.toList(array, Foo.class);
        System.out.println(list.toString());
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class Foo {
        String name;
    }

}
