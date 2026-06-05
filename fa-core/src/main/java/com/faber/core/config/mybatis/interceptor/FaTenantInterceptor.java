package com.faber.core.config.mybatis.interceptor;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.plugins.handler.TenantLineHandler;
import com.baomidou.mybatisplus.extension.plugins.inner.TenantLineInnerInterceptor;
import com.faber.core.bean.BaseTnCrtEntity;
import com.faber.core.bean.BaseTnDelEntity;
import com.faber.core.bean.BaseTnUpdEntity;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.exception.BuzzException;
import net.sf.jsqlparser.expression.Expression;
import net.sf.jsqlparser.expression.StringValue;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AssignableTypeFilter;
import org.springframework.util.ClassUtils;

import java.lang.reflect.Modifier;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

/**
 * 基于实体继承关系的租户拦截器。
 * 继承租户基础实体的实体对应表，会自动追加 tenant_id 条件。
 */
public class FaTenantInterceptor extends TenantLineInnerInterceptor {

    private static final Class<?>[] TENANT_ENTITY_CLASSES = {
            BaseTnCrtEntity.class,
            BaseTnUpdEntity.class,
            BaseTnDelEntity.class
    };

    public FaTenantInterceptor() {
        super(new FaTenantLineHandler());
    }

    private static class FaTenantLineHandler implements TenantLineHandler {

        private final Set<String> tenantTables = resolveTenantTables();

        @Override
        public String getTenantIdColumn() {
            return "tenant_id";
        }

        @Override
        public Expression getTenantId() {
            String tenantId = BaseContextHandler.getTenantId();
            if (StrUtil.isBlank(tenantId)) {
                throw new BuzzException("当前租户上下文为空");
            }
            return new StringValue(tenantId);
        }

        @Override
        public boolean ignoreTable(String tableName) {
            return !tenantTables.contains(normalizeTableName(tableName));
        }

    }

    private static Set<String> resolveTenantTables() {
        Set<String> tenantTables = new HashSet<>();
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        for (Class<?> tenantEntityClass : TENANT_ENTITY_CLASSES) {
            scanner.addIncludeFilter(new AssignableTypeFilter(tenantEntityClass));
        }
        ClassLoader classLoader = ClassUtils.getDefaultClassLoader();

        scanner.findCandidateComponents("com.faber").forEach(beanDefinition -> {
            try {
                Class<?> clazz = ClassUtils.forName(beanDefinition.getBeanClassName(), classLoader);
                if (isTenantBaseEntity(clazz) || clazz.isInterface() || Modifier.isAbstract(clazz.getModifiers())) {
                    return;
                }
                tenantTables.add(resolveTableName(clazz));
            } catch (ClassNotFoundException e) {
                throw new BuzzException("解析租户实体失败：" + beanDefinition.getBeanClassName());
            }
        });

        return tenantTables;
    }

    private static boolean isTenantBaseEntity(Class<?> clazz) {
        for (Class<?> tenantEntityClass : TENANT_ENTITY_CLASSES) {
            if (clazz == tenantEntityClass) {
                return true;
            }
        }
        return false;
    }

    private static String resolveTableName(Class<?> clazz) {
        TableName tableName = clazz.getAnnotation(TableName.class);
        if (tableName != null && StrUtil.isNotBlank(tableName.value())) {
            return normalizeTableName(tableName.value());
        }
        return normalizeTableName(camelToUnderline(clazz.getSimpleName()));
    }

    private static String normalizeTableName(String tableName) {
        return StrUtil.removeAll(tableName, "`").toLowerCase(Locale.ROOT);
    }

    private static String camelToUnderline(String value) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            if (Character.isUpperCase(c) && i > 0) {
                builder.append('_');
            }
            builder.append(Character.toLowerCase(c));
        }
        return builder.toString();
    }

}
