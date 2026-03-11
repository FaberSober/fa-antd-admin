package com.faber.core.config.mybatis.handler;

import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;
import org.postgresql.util.PGobject;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * 通用 JSON 字段处理器
 * <p>
 * 1. 自动识别数据库类型
 * 2. PostgreSQL: 转换为 PGobject 存入，解决 "column is type json but expression is type varchar" 问题
 * 3. MySQL: 直接以 String 存入
 * </p>
 */
@Slf4j
@MappedTypes({Object.class})
@MappedJdbcTypes(JdbcType.VARCHAR)
public class UniversalJsonTypeHandler extends JacksonTypeHandler {

    // 构造函数必须匹配，供 MyBatis-Plus 反射调用
    public UniversalJsonTypeHandler(Class<?> type) {
        super(type);
    }

    public UniversalJsonTypeHandler(Class<?> type, Field field) {
        super(type, field);
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Object parameter, JdbcType jdbcType) throws SQLException {
        // 1. 将对象转换为 JSON 字符串
        String json = toJson(parameter);

        // 2. 获取底层连接，判断数据库类型
        Connection connection = ps.getConnection();
        String dbName = connection.getMetaData().getDatabaseProductName();

        // 3. 针对 PostgreSQL 特殊处理
        if ("PostgreSQL".equalsIgnoreCase(dbName)) {
            PGobject pgObject = new PGobject();
            // 注意：如果你的数据库字段是 jsonb，这里改成 "jsonb"
            // 根据你的报错 "column 'data' is of type json"，这里填 "json"
            pgObject.setType("json"); 
            pgObject.setValue(json);
            ps.setObject(i, pgObject);
        } else {
            // 4. MySQL / H2 / Oracle 等其他数据库，直接 setString
            ps.setString(i, json);
        }
    }
}