package com.faber.core.config.mybatis.handler;

import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;
import org.postgresql.util.PGobject;

import java.lang.reflect.Field;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 通用 JSON 字段处理器
 * <p>
 * 1. 自动识别数据库类型
 * 2. PostgreSQL: 转换为 PGobject 存入
 * 3. MySQL: 直接以 String 存入
 * 4. 读取时兼容 JSON 对象和数组，不强制类型匹配
 * </p>
 */
@Slf4j
@MappedTypes({Object.class})
@MappedJdbcTypes(JdbcType.VARCHAR)
public class UniversalJsonTypeHandler extends JacksonTypeHandler {

    private final Class<?> fieldType;

    public UniversalJsonTypeHandler(Class<?> type) {
        super(type);
        this.fieldType = type;
    }

    public UniversalJsonTypeHandler(Class<?> type, Field field) {
        super(type, field);
        this.fieldType = field != null ? field.getType() : type;
    }

    @Override
    public Object parse(String json) {
        // 当字段声明为 Object 时，使用通用方式解析 JSON
        // Jackson 会将 {...} 解析为 LinkedHashMap，[...] 解析为 ArrayList
        if (fieldType == Object.class) {
            return parseAsGenericObject(json);
        }
        try {
            return super.parse(json);
        } catch (Exception e) {
            // 兜底：父类解析失败时也用通用方式
            return parseAsGenericObject(json);
        }
    }

    private Object parseAsGenericObject(String json) {
        if (json == null || json.isBlank()) {
            return null;
        }
        try {
            ObjectMapper mapper = getObjectMapper();
            return mapper.readValue(json, Object.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON: " + json, e);
        }
    }

    @Override
    public Object getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String json = rs.getString(columnName);
        if (json == null || json.isBlank()) return null;
        if (fieldType == Object.class) return parseAsGenericObject(json);
        return parse(json);
    }

    @Override
    public Object getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String json = rs.getString(columnIndex);
        if (json == null || json.isBlank()) return null;
        if (fieldType == Object.class) return parseAsGenericObject(json);
        return parse(json);
    }

    @Override
    public Object getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String json = cs.getString(columnIndex);
        if (json == null || json.isBlank()) return null;
        if (fieldType == Object.class) return parseAsGenericObject(json);
        return parse(json);
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Object parameter, JdbcType jdbcType) throws SQLException {
        String json = toJson(parameter);

        Connection connection = ps.getConnection();
        String dbName = connection.getMetaData().getDatabaseProductName();

        if ("PostgreSQL".equalsIgnoreCase(dbName)) {
            PGobject pgObject = new PGobject();
            pgObject.setType("json");
            pgObject.setValue(json);
            ps.setObject(i, pgObject);
        } else {
            ps.setString(i, json);
        }
    }
}