package com.faber.core.config.mybatis.handler;

import com.fasterxml.jackson.core.type.TypeReference;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public abstract class AbstractObjectTypeHandler<T> extends BaseTypeHandler<T> {
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Object parameter, JdbcType jdbcType) throws SQLException {
        String json = GenericAndJson.objectToJson(parameter);
        ps.setString(i, json);
    }

    @Override
    public T getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String string = rs.getString(columnName);
        return GenericAndJson.jsonToObject(string, new TypeReference<T>() {
        });
    }

    @Override
    public T getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String string = rs.getString(columnIndex);
        return GenericAndJson.jsonToObject(string, new TypeReference<T>() {
        });
    }

    @Override
    public T getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String string = cs.getString(columnIndex);
        return GenericAndJson.jsonToObject(string, new TypeReference<T>() {
        });
    }
}

