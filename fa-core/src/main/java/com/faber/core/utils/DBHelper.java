package com.faber.core.utils;

import lombok.extern.slf4j.Slf4j;

import java.sql.*;

@Slf4j
public class DBHelper {

    public static final class JdbcDriver {
        public static final String OracleDriver = "oracle.jdbc.driver.OracleDriver";
        public static final String DB2Driver = "com.ibm.db2.jcc.DB2Driver";
        public static final String MysqlDriver = "com.mysql.jdbc.Driver";
        public static final String SQLServerDriver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
        public static final String GreenplumDriver = "com.pivotal.jdbc.GreenplumDriver";
        public static final String HiveDriver = "org.apache.hadoop.hive.jdbc.HiveDriver";
    }

    /**
     * @param jdbcurl
     * @param username
     * @param password
     * @param autoCommit
     * @return
     * @author Liyg
     * @description 创建ORACLE连接信息
     */
    public static Connection initOracle(String jdbcurl, String username, String password, boolean autoCommit) {
        Connection conn = null;
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            //连接数据库
            conn = DriverManager.getConnection(jdbcurl, username, password);
            conn.setAutoCommit(autoCommit);
        } catch (Exception se) {
            //连接失败
            log.error("ORACLE连接失败", se);
            return null;
        }
        return conn;
    }

    /**
     * @param jdbcurl
     * @param username
     * @param password
     * @param autoCommit
     * @return
     * @author Liyg
     * @description 创建DB2连接信息
     */
    public static Connection initDB2(String jdbcurl, String username, String password, boolean autoCommit) {
        Connection conn = null;
        try {
            Driver driver = (Driver) Class.forName("com.ibm.db2.jcc.DB2Driver").newInstance();
            //连接数据库
            DriverManager.registerDriver(driver);
            conn = DriverManager.getConnection(jdbcurl, username, password);
            conn.setAutoCommit(autoCommit);
        } catch (Exception se) {
            log.error("DB2连接失败", se);
            return null;
        }
        return conn;
    }

    /**
     * @param jdbcurl
     * @param username
     * @param password
     * @param autoCommit
     * @return
     * @author Liyg
     * @description 创建MYSQL连接信息
     */
    public static Connection initMysql(String jdbcurl, String username, String password, boolean autoCommit) throws SQLException {
        Connection conn = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        //连接数据库
        conn = DriverManager.getConnection(jdbcurl, username, password);
        conn.setAutoCommit(autoCommit);
        return conn;
    }

    /**
     * @param jdbcurl
     * @param username
     * @param password
     * @param autoCommit
     * @return
     * @author Liyg
     * @description 创建SQLServer连接信息
     */
    public static Connection initSQLServer(String jdbcurl, String username, String password, boolean autoCommit) {
        Connection conn = null;
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            // 连接数据库
            conn = DriverManager.getConnection(jdbcurl, username, password);
            conn.setAutoCommit(autoCommit);
        } catch (Exception se) {
            // 连接失败
            log.error("SQLSERVER连接失败", se);
            return null;
        }
        return conn;
    }


    /**
     * @param jdbcurl
     * @param username
     * @param password
     * @param autoCommit
     * @return
     * @author zk
     * @description 创建GreenPlum连接信息
     */
    public static Connection initGreenPlum(String jdbcurl, String username, String password, boolean autoCommit) {
        Connection conn = null;
        try {
            Class.forName("com.pivotal.jdbc.GreenplumDriver");
            conn = DriverManager.getConnection(jdbcurl, username, password);
            conn.setAutoCommit(autoCommit);
        } catch (Exception se) {
            // 连接失败
            log.error("GREENPLUM连接失败", se);
            return null;
        }
        return conn;
    }

    /**
     * @param jdbcurl
     * @param username
     * @param password
     * @param autoCommit
     * @return
     * @author zk
     * @description 创建HIVE连接信息
     */
    public static Connection initHIVE(String jdbcurl, String username, String password, boolean autoCommit) {
        Connection conn = null;
        try {
            Class.forName("org.apache.hadoop.hive.jdbc.HiveDriver");
            conn = DriverManager.getConnection(jdbcurl, username, password);
            conn.setAutoCommit(autoCommit);
        } catch (Exception se) {
            // 连接失败
            log.error("HIVE连接失败", se);
            return null;
        }
        return conn;
    }

    /**
     * @param jdbcUrl
     * @param username
     * @param password
     * @param autoCommit
     * @return
     * @author Liyg
     * @description 根据传入的数据源类型，创建Connection连接信息
     */
    public static Connection intiConnection(String jdbcDriver, String jdbcUrl, String username, String password, boolean autoCommit) {
        Connection conn = null;
        try {
            Class.forName(jdbcDriver);
            // 连接数据库
            conn = DriverManager.getConnection(jdbcUrl, username, password);
            conn.setAutoCommit(autoCommit);
        } catch (Exception se) {
            // 连接失败
            log.error("连接失败", se);
            return null;
        }
        return conn;
    }

    /**
     * 关闭数据库
     *
     * @param conn
     * @param pstmt
     * @author Liyg
     */
    public static void closeDB(Connection conn, PreparedStatement pstmt, ResultSet rs) {
        try {
            if (rs != null) {
                rs.close();
            }
            rs = null;

            if (pstmt != null) {
                pstmt.close();
            }
            pstmt = null;

            if (conn != null) {
                conn.close();
            }
            conn = null;
        } catch (Exception ee) {
            log.error("数据源关闭失败", ee);
        }
    }

}
