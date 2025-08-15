package com.faber.core.utils;

import org.apache.ibatis.jdbc.ScriptRunner;

import java.io.StringReader;
import java.sql.Connection;
import java.sql.SQLException;

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

    /**
     * 执行sql脚本
     *
     * @param sql
     * @throws SQLException
     */
    public static void executeSql(Connection conn, String sql) {
        // 执行sql脚本
        ScriptRunner runner = new ScriptRunner(conn);
        runner.setFullLineDelimiter(false);
        runner.setDelimiter(";");//语句结束符号设置
        runner.setLogWriter(null);//日志数据输出，这样就不会输出过程
        runner.setSendFullScript(false);
        runner.setAutoCommit(true);
        runner.setStopOnError(true);
        runner.runScript(new StringReader(sql));
    }

}
