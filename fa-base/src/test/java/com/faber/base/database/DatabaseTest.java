package com.faber.base.database;

import cn.hutool.db.Entity;
import cn.hutool.db.handler.EntityListHandler;
import cn.hutool.db.sql.SqlExecutor;
import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.faber.FaTestApp;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * @author Farando
 * @date 2023/2/18 17:24
 * @description
 */
@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DatabaseTest {

    @Autowired
    DruidDataSource druidDataSource;

    @Test
    public void testConn() throws SQLException {
        DruidPooledConnection druidPooledConnection = druidDataSource.getConnection();
        Connection conn = druidPooledConnection.getConnection();

        PreparedStatement ps = conn.prepareStatement("select 1 from dual");
        Boolean result = ps.execute();
        log.debug("result: {}", result);
    }

    @Test
    public void testQuery() throws SQLException {
        DruidPooledConnection druidPooledConnection = druidDataSource.getConnection();
        Connection conn = druidPooledConnection.getConnection();


        List<Entity> entityList = SqlExecutor.query(conn, "select * from base_dict", new EntityListHandler());
        log.info("{}", entityList);
    }


}
