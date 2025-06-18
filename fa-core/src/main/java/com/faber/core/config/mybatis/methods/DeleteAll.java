package com.faber.core.config.mybatis.methods;

import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.SqlSource;

import com.baomidou.mybatisplus.core.injector.AbstractMethod;
import com.baomidou.mybatisplus.core.metadata.TableInfo;

/**
 * 删除全部-逻辑删除
 * @author nieqiurong 2018/8/11 20:29.
 */
public class DeleteAll extends AbstractMethod {

    public DeleteAll(String methodName) {
        super(methodName);
    }

    @Override
    public MappedStatement injectMappedStatement(Class<?> mapperClass, Class<?> modelClass, TableInfo tableInfo) {
        String sql = "delete from " + tableInfo.getTableName();
        if (tableInfo.isWithLogicDelete()) {
            /* 执行 SQL ，动态 SQL 参考类 SqlMethod */
            sql = "update " + tableInfo.getTableName() + " set delete = true where delete = false";
        }
        /* mapper 接口方法名一致 */
        SqlSource sqlSource = languageDriver.createSqlSource(configuration, sql, modelClass);
        return this.addDeleteMappedStatement(mapperClass, methodName, sqlSource);
    }
}
