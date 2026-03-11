package com.faber.core.utils;

import java.util.regex.Pattern;

import com.faber.core.exception.BuzzException;

import cn.hutool.core.util.StrUtil;

public class FaSqlUtils {

    /**
     * 验证排序字符串的安全性
     * 
     * @param sorter 排序字符串
     * @throws BuzzException 当验证失败时抛出异常
     */
    public static void validateSorterSafety(String sorter) {
        if (StrUtil.isEmpty(sorter)) {
            return;
        }

        // 1. 基础格式验证：只允许 "字段名 ASC" 或 "字段名 DESC" 格式
        // 支持多个排序字段，用逗号分隔："field1 ASC, field2 DESC"
        String[] sortItems = sorter.split(",");

        for (String item : sortItems) {
            String trimmedItem = item.trim();
            validateSingleSortItem(trimmedItem);
        }
    }

    /**
     * 验证单个排序项的安全性
     * 
     * @param sortItem 单个排序项，格式："字段名 ASC"或"字段名 DESC"
     */
    private static void validateSingleSortItem(String sortItem) {
        // 2. 正则表达式验证：字段名只能包含字母、数字、下划线，后跻ASC或DESC
        // 支持驼峰命名和下划线命名：userId, user_id, createTime等
        String sortPattern = "^[a-zA-Z_][a-zA-Z0-9_\\.]*\\s+(ASC|DESC|asc|desc)$";
        Pattern pattern = Pattern.compile(sortPattern);

        if (!pattern.matcher(sortItem).matches()) {
            throw new BuzzException("排序参数格式错误，只允许'字段名 ASC'或'字段名 DESC'的格式，当前值: " + sortItem);
        }

        // 3. 危险字符检查
        String[] dangerousChars = {
                ";", "--", "/*", "*/", "'", "\"", "<", ">",
                "=", "(", ")", "+", "-", "*", "/", "%",
                "|", "&", "^", "~", "?", ":", "@", "#",
                "!", "$", "[", "]", "{", "}", "\\"
        };

        for (String dangerousChar : dangerousChars) {
            if (sortItem.contains(dangerousChar)) {
                throw new BuzzException("排序参数包含危险字符: '" + dangerousChar + "'，存在SQL注入风险");
            }
        }

        // 4. SQL关键字检查（大小写不敏感）
        String upperItem = sortItem.toUpperCase();
        String[] sqlKeywords = {
                "SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "CREATE", "ALTER",
                "TRUNCATE", "EXEC", "EXECUTE", "UNION", "JOIN", "WHERE", "HAVING",
                "GROUP", "ORDER", "LIMIT", "OFFSET", "INTO", "VALUES", "SET", "FROM",
                "TABLE", "DATABASE", "SCHEMA", "INDEX", "VIEW", "PROCEDURE", "FUNCTION",
                "TRIGGER", "GRANT", "REVOKE", "COMMIT", "ROLLBACK", "TRANSACTION",
                "DECLARE", "CURSOR", "LOOP", "WHILE", "IF", "ELSE", "CASE", "WHEN",
                "SCRIPT", "SLEEP", "BENCHMARK", "LOAD_FILE", "OUTFILE", "DUMPFILE"
        };

        for (String keyword : sqlKeywords) {
            // 避免误判ASC和DESC
            if (keyword.equals("ASC") || keyword.equals("DESC")) {
                continue;
            }

            if (upperItem.equalsIgnoreCase(keyword)) {
                throw new BuzzException("排序参数包含SQL关键字: '" + keyword + "'，存在安全风险");
            }
        }

        // 5. 字段名长度检查（防止过长的字段名）
        String[] parts = sortItem.split("\\s+");
        if (parts.length >= 2) {
            String fieldName = parts[0];
            if (fieldName.length() > 50) {
                throw new BuzzException("字段名过长，最大长度为50个字符，当前长度: " + fieldName.length());
            }
        }
    }

}
