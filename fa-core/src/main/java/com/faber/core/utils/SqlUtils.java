package com.faber.core.utils;

/**
 * SQL utils
 * @author xu.pengfei
 * @date 2022/11/28 14:33
 */
public class SqlUtils {

    /**
     * LIKE查询替换特殊字符
     * @param value
     * @return
     */
    public static String filterLikeValue(String value) {
        String s = new String(value);
        s = s.replaceAll("%", "\\\\%");
        s = s.replaceAll("\'", "\\\\'");
        s = s.replaceAll("_", "\\\\_");
        s = s.replaceAll("\\\\", "\\\\\\\\\\\\");
        return s;
    }

}
