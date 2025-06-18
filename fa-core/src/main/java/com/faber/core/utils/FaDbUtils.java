package com.faber.core.utils;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import java.util.function.Consumer;

/**
 * @author Farando
 * @date 2023/2/19 20:46
 * @description
 */
public class FaDbUtils {

    /**
     * 从数据库连接url中解析数据库名称
     * @param url
     * @return
     */
    public static String getNameFromUrl(String url) {
        String subUrl = url.substring(url.indexOf("//") + 2);

        if (subUrl.contains("?")) {
            return subUrl.substring(subUrl.indexOf("/") + 1, subUrl.indexOf("?"));
        }

        return subUrl.substring(subUrl.indexOf("/") + 1);
    }

    public static <T> void loopPage(LambdaQueryChainWrapper<T> wrapper, Consumer<PageInfo<T>> consumer) {
        loopPage(wrapper, consumer, 1000);
    }

    /**
     * 分页方式循环获取数据
     * @param wrapper
     * @param consumer
     * @param pageSize
     * @param <T>
     */
    public static <T> void loopPage(LambdaQueryChainWrapper<T> wrapper, Consumer<PageInfo<T>> consumer, int pageSize) {
        long total = wrapper.count();
        int page = (int) Math.ceil(total / (double)pageSize);

        for (int i = 1; i <= page; i++) {
            PageInfo<T> info = PageHelper.startPage(i, pageSize)
                    .doSelectPageInfo(() -> wrapper.list());
            consumer.accept(info);
        }
    }

}
