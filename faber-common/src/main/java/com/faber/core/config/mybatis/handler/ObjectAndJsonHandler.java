package com.faber.core.config.mybatis.handler;

import com.fasterxml.jackson.core.type.TypeReference;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * object和json字符串 互相转化
 */
@MappedJdbcTypes({JdbcType.VARCHAR})
public class ObjectAndJsonHandler extends BaseTypeHandler<Object> {
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Object parameter, JdbcType jdbcType) throws SQLException {
        String json = GenericAndJson.objectToJson(parameter);
        ps.setString(i, json);
    }

    @Override
    public Object getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String string = rs.getString(columnName);
        return GenericAndJson.jsonToObject(string, new TypeReference<Object>() {
        });
    }

    @Override
    public Object getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String string = rs.getString(columnIndex);
        return GenericAndJson.jsonToObject(string, new TypeReference<Object>() {
        });
    }

    @Override
    public Object getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String string = cs.getString(columnIndex);
        return GenericAndJson.jsonToObject(string, new TypeReference<Object>() {
        });
    }
}

