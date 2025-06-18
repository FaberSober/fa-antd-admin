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
import java.util.Arrays;
import java.util.List;


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

    /**
     * 包含租户ID(tenant_id)字段的表
     * TODO 要支持配置文件
     */
    private static final List<String> TENANT_EXCLUDE_TABLES = Arrays.asList("tn_tenant", "tn_tenant_user", "tn_tenant_corp", "tn_tenant_corp_agent", "tn_tenant_rbac_menu");

    /**
     * 是否是租户表
     *
     * @return
     */
    private boolean isTenantTable(String tableName) {
        if (TENANT_EXCLUDE_TABLES.contains(tableName)) return false;
        return tableName.startsWith("tn_");
    }

    /**
     * 是否是企业表
     * @return
     */
    private boolean isCorpTable(String tableName) {
        if (TENANT_EXCLUDE_TABLES.contains(tableName)) return false;
        return tableName.startsWith("tn_");
    }

    @Bean("mybatisSqlSession")
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource, GlobalConfig globalConfig) throws Exception {
        MybatisSqlSessionFactoryBean sqlSessionFactory = new MybatisSqlSessionFactoryBean();
        /* 数据源 */
        sqlSessionFactory.setDataSource(dataSource);
        /* xml扫描 */
        sqlSessionFactory.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath*:/mapper/**/*.xml"));
        /* 扫描 typeHandler */
//        sqlSessionFactory.setTypeHandlersPackage("com.baomidou.mybatisplus.samples.mysql.type");
        MybatisConfiguration configuration = new MybatisConfiguration();
        configuration.setJdbcTypeForNull(JdbcType.NULL);
        /* 驼峰转下划线 */
        configuration.setMapUnderscoreToCamelCase(true);
        MybatisPlusInterceptor mybatisPlusInterceptor = new MybatisPlusInterceptor();

        // 如果用了分页插件注意先 add TenantLineInnerInterceptor 再 add PaginationInnerInterceptor
        // 多租户
//        mybatisPlusInterceptor.addInnerInterceptor(new TenantLineInnerInterceptor(new TenantLineHandler() {
//            @Override
//            public String getTenantIdColumn() {
//                return "tenant_id";
//            }
//
//            @Override
//            public Expression getTenantId() {
//                // TO-DO 这里获取上下文的租户ID
//                return new LongValue(TnTenantContextHandler.getTenantId());
//            }
//
//            // 这是 default 方法,默认返回 false 表示所有表都需要拼多租户条件
//            @Override
//            public boolean ignoreTable(String tableName) {
//                return !isTenantTable(tableName);
//            }
//        }));
        // 租户下创建的企业
//        mybatisPlusInterceptor.addInnerInterceptor(new TenantLineInnerInterceptor(new TenantLineHandler() {
//            @Override
//            public String getTenantIdColumn() {
//                return "corp_id";
//            }
//
//            @Override
//            public Expression getTenantId() {
//                // TO-DO 这里获取上下文的租户ID
//                return new LongValue(TnTenantContextHandler.getCorpId());
//            }
//
//            // 这是 default 方法,默认返回 false 表示所有表都需要拼多租户条件
//            @Override
//            public boolean ignoreTable(String tableName) {
//                return !isCorpTable(tableName);
//            }
//        }));

        // 动态表名
        DynamicTableNameInnerInterceptor dynamicTableNameInnerInterceptor = new DynamicTableNameInnerInterceptor();
        dynamicTableNameInnerInterceptor.setTableNameHandler((sql, tableName) -> {
            boolean multi = faSetting.getDb() != null && faSetting.getDb().getMultiTables() != null && faSetting.getDb().getMultiTables().contains(tableName.toLowerCase());
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

        mybatisPlusInterceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
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
        conf.setDbConfig(new GlobalConfig.DbConfig().setColumnFormat("`%s`").setPropertyFormat("`%s`"));
        return conf;
    }

}
