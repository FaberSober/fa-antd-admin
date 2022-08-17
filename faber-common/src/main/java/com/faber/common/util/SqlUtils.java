package com.faber.common.util;

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
