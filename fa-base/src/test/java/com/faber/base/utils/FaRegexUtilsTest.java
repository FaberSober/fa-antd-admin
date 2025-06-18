package com.faber.base.utils;

import cn.hutool.core.util.ReUtil;
import org.junit.jupiter.api.Test;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FaRegexUtilsTest {

    @Test
    public void testRegexChinese() {
        String input = "Hello 你好 World 世界";

        // 定义中文字符的正则表达式
        String chineseRegex = "[\u4e00-\u9fa5]";

        // 编译正则表达式
        Pattern pattern = Pattern.compile(chineseRegex);

        // 创建 Matcher 对象
        Matcher matcher = pattern.matcher(input);

        // 查找匹配的中文字符
        while (matcher.find()) {
            System.out.println("匹配到中文字符: " + matcher.group());
        }
    }

    @Test
    public void testFindChinese() {
        // 定义中文字符的正则表达式
        String chineseRegex = "[\u4e00-\u9fa5]+";

        System.out.println("--------------------- isMatch --------------------->>>>");
        System.out.println(ReUtil.isMatch(chineseRegex, "Hello 你好 World 世界"));
        System.out.println(ReUtil.isMatch(chineseRegex, "你好世界"));

        System.out.println("--------------------- isMatch --------------------->>>>");
        System.out.println(ReUtil.isMatch("[a-zA-Z\\-—]+", "-—Surgesuppressionvaristors"));

        System.out.println("--------------------- contains --------------------->>>>");
        System.out.println(ReUtil.contains(chineseRegex, "Hello 你好 World 世界"));
        System.out.println(ReUtil.contains(chineseRegex, "你好世界"));
    }

}
