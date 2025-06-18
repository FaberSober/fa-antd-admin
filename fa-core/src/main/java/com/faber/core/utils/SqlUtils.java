package com.faber.core.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.jdbc.ScriptRunner;

import java.io.StringReader;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * SQL utils
 * @author xu.pengfei
 * @date 2022/11/28 14:33
 */
@Slf4j
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

    public static void executeSql(Connection conn, String sql) throws SQLException {
        // 执行SQL脚本
        ScriptRunner runner = new ScriptRunner(conn);
        runner.setFullLineDelimiter(false);
        runner.setDelimiter(";");        // 语句结束符号设置
        runner.setLogWriter(null);       // 日志数据输出，这样就不会输出过程
        runner.setSendFullScript(false);
        runner.setAutoCommit(true);
        runner.setStopOnError(true);
        try {
            runner.runScript(new StringReader(sql));
        } finally {
            // 确保连接始终关闭
            try {
                conn.close();
            } catch (SQLException e) {
                // 记录关闭连接时的异常
                log.error("关闭数据库连接时发生异常", e);
            }
        }
    }
}
