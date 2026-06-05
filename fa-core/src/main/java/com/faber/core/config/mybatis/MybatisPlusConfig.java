package com.faber.core.config.mybatis;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.MybatisConfiguration;
import com.baomidou.mybatisplus.core.config.GlobalConfig;
import com.baomidou.mybatisplus.extension.MybatisMapWrapperFactory;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.BlockAttackInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.DynamicTableNameInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean;
import com.faber.core.config.mybatis.base.FaSqlInjector;
import com.faber.core.config.mybatis.handler.MysqlMetaObjectHandler;
import com.faber.core.config.mybatis.interceptor.FaTenantInterceptor;
import com.faber.core.constant.FaSetting;
import com.faber.core.context.BaseContextHandler;
import jakarta.annotation.Resource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.type.JdbcType;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

/**
 * Mybatis Plus Config
 *
 * @author xu.pengfei
 * @date 2022/11/28 11:41
 */
@Configuration
@MapperScan("com.faber.**.mapper")
public class MybatisPlusConfig {

    @Resource
    FaSetting faSetting;

    @Bean("mybatisSqlSession")
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource, GlobalConfig globalConfig) throws Exception {
        MybatisSqlSessionFactoryBean sqlSessionFactory = new MybatisSqlSessionFactoryBean();
        /* 数据源 */
        sqlSessionFactory.setDataSource(dataSource);
        /* xml扫描 */
        // classpath:/mapper/**/*.xml 只会扫描第一个 classpath 根目录
        // 多模块项目，使用classpath*:/mapper/**/*.xml，Spring 会扫描所有依赖 jar 包和模块的 classpath，子模块的 xml 也能加载到。
        sqlSessionFactory.setMapperLocations(
                new PathMatchingResourcePatternResolver().getResources("classpath*:/mapper/**/*.xml"));
        /* 扫描 typeHandler */
        // sqlSessionFactory.setTypeHandlersPackage("com.baomidou.mybatisplus.samples.mysql.type");
        MybatisConfiguration configuration = new MybatisConfiguration();
        configuration.setJdbcTypeForNull(JdbcType.NULL);
        /* 驼峰转下划线 */
        configuration.setMapUnderscoreToCamelCase(true);
        MybatisPlusInterceptor mybatisPlusInterceptor = new MybatisPlusInterceptor();

        // 如果用了分页插件注意先 add TenantLineInnerInterceptor 再 add PaginationInnerInterceptor
        if (faSetting.getTenant() != null && faSetting.getTenant().isEnabled()) {
            mybatisPlusInterceptor.addInnerInterceptor(new FaTenantInterceptor());
        }

        // 动态表名
        DynamicTableNameInnerInterceptor dynamicTableNameInnerInterceptor = new DynamicTableNameInnerInterceptor(
                (sql, tableName) -> {
                    boolean multi = faSetting.getDb() != null && faSetting.getDb().getMultiTables() != null
                            && faSetting.getDb().getMultiTables().contains(tableName.toLowerCase());
                    if (!multi) { // 不是多表名
                        return tableName;
                    }

                    String suffix = BaseContextHandler.getTableSuffix();
                    if (StrUtil.isEmpty(suffix)) {
                        return tableName;
                    }
                    return tableName + "_" + suffix;
                });
        mybatisPlusInterceptor.addInnerInterceptor(dynamicTableNameInnerInterceptor);

        PaginationInnerInterceptor paginationInterceptor = new PaginationInnerInterceptor();
        // paginationInterceptor.setDbType(DbType.POSTGRE_SQL); // 指定数据库
        // paginationInterceptor.setOptimizeJoin(true); // COUNT SQL 优化
        mybatisPlusInterceptor.addInnerInterceptor(paginationInterceptor);
        mybatisPlusInterceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        // 防全表更新与删除插件
        mybatisPlusInterceptor.addInnerInterceptor(new BlockAttackInnerInterceptor());

        sqlSessionFactory.setPlugins(mybatisPlusInterceptor);

        /* map 下划线转驼峰 */
        configuration.setObjectWrapperFactory(new MybatisMapWrapperFactory());
        sqlSessionFactory.setConfiguration(configuration);

        /* 自动填充插件 */
        globalConfig.setMetaObjectHandler(new MysqlMetaObjectHandler());

        globalConfig.setSqlInjector(new FaSqlInjector());

        sqlSessionFactory.setGlobalConfig(globalConfig);
        return sqlSessionFactory.getObject();
    }

    @Bean
    public GlobalConfig globalConfig() {
        GlobalConfig conf = new GlobalConfig();
        // conf.setDbConfig(new GlobalConfig.DbConfig().setColumnFormat("`%s`").setPropertyFormat("`%s`"));
        return conf;
    }

}
