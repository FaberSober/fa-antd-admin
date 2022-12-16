package com.faber.core.config.mybatis;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.ReflectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.annotation.SqlSearch;
import com.faber.core.utils.FaMapUtils;
import com.faber.core.utils.SqlUtils;
import com.faber.core.vo.query.Sorter;
import com.faber.core.vo.query.Condition;
import com.faber.core.vo.query.ConditionGroup;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.vo.query.enums.ConditionGroupTypeEnum;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * 基于MybatisPlus的高级组合查询帮助类
 * @author xu.pengfei
 * @date 2022/11/28 14:22
 */
@Slf4j
public class WrapperUtils {

    public static <T> QueryWrapper<T> parseQuery(QueryParams queryParams, Class<T> clazz) {
        QueryWrapper<T> wrapper = new QueryWrapper<>();

        Map<String, Object> query = FaMapUtils.removeEmptyValue(queryParams.getQuery());

        boolean condition = query.size() > 0;
        wrapper.and(condition, ew -> {
            for (Map.Entry<String, Object> entry : query.entrySet()) {
                // xxx#$min，xxx#$max 类型的key，为最小值、最大值判定
                String key = entry.getKey();
                if (key.contains("#$")) {
                    String fieldName = key.substring(0, key.indexOf("#$"));
                    fieldName = StrUtil.toUnderlineCase(fieldName); // 转下划线
                    String opr = key.substring(key.indexOf("#$") + 2);
                    if ("min".equals(opr)) {
                        ew.ge(fieldName, entry.getValue());
                    } else if ("max".equals(opr)) {
                        ew.le(fieldName, entry.getValue());
                    } else if ("in".equals(opr)) {
                        if (entry.getValue() != null && StringUtils.isNotEmpty(entry.getValue().toString())) {
                            List list = (List) entry.getValue();
                            ew.in(list.size() > 0, fieldName, list);
                        }
                    }
                    continue;
                }

                if (StrUtil.isEmpty(entry.getValue().toString())) continue;

                // TO-DO: 增加注解方式，有的string属性需要强制指定为equals查询
                Field field = ReflectUtil.getField(clazz, entry.getKey());
                boolean forceEqual = field != null && field.getAnnotation(SqlEquals.class) != null;

//                if (field == null) {
//                    log.warn("No field {} Found", entry.getKey());
//                    continue;
//                }

                String fieldColumn = StrUtil.toUnderlineCase(entry.getKey());
                if (forceEqual) {
                    ew.eq(fieldColumn, entry.getValue());
                } else {
                    ew.like(fieldColumn, SqlUtils.filterLikeValue(StrUtil.toString(entry.getValue())));
                }
            }
        });

        // 单查询字段
        if (StringUtils.isNotEmpty(queryParams.getSearch())) {
            wrapper.and(ew -> {
                for (Field field : clazz.getDeclaredFields()) {
                    SqlSearch annotation = field.getAnnotation(SqlSearch.class);
                    if (annotation != null) {
                        String fieldColumn = StrUtil.toUnderlineCase(field.getName());
                        ew.like(fieldColumn, SqlUtils.filterLikeValue(queryParams.getSearch()));
                    }
                }
            });
        }

        // 高级查询-过滤条件List
        if (queryParams.getConditionList() != null && queryParams.getConditionList().size() > 0) {
            for (ConditionGroup conditionGroup : queryParams.getConditionList()) {
                processConditionList(conditionGroup, wrapper);
            }
        }

        Sorter sorter = queryParams.getSorterInfo();
        if (sorter != null) {
            wrapper.orderBy(true, sorter.isAsc(), sorter.getField());
        }

        return wrapper;
    }

    /**
     * @param conditionGroup
     * @param wrapper
     */
    private static <T> void processConditionList(ConditionGroup conditionGroup, QueryWrapper<T> wrapper) {
        wrapper.and(conditionGroup.getCondList().size() > 0, ew -> {
            for (Condition cond : conditionGroup.getCondList()) {
                String column = StrUtil.toUnderlineCase(cond.getKey());

                if (conditionGroup.getType() == ConditionGroupTypeEnum.OR) {
                    ew.or();
                }

                Object value = cond.getValue();
                switch (cond.getOpr()) {
                    case EQ:
                        ew.or().eq(column, value);
                        break;
                    case NE:
                        ew.ne(column, value);
                        break;
                    case IN:
                        List<String> list;
                        if (value instanceof List) {
                            list = (List<String>) value;
                        } else {
                            list = Arrays.asList(ObjectUtil.toString(value).split("[,，]"));
                        }
                        ew.in(list.size() > 0, column, list);
                        break;
                    case LIKE:
                        ew.like(column, SqlUtils.filterLikeValue(ObjectUtil.toString(value)));
                        break;
                    case NOT_LIKE:
                        ew.notLike(column, SqlUtils.filterLikeValue(ObjectUtil.toString(value)));
                        break;
                    case LIKE_LEFT:
                        ew.likeLeft(column, SqlUtils.filterLikeValue(ObjectUtil.toString(value)));
                        break;
                    case LIKE_RIGHT:
                        ew.likeRight(column, SqlUtils.filterLikeValue(ObjectUtil.toString(value)));
                        break;
                    case GT:
                        ew.gt(column, value);
                        break;
                    case GE:
                        ew.ge(column, value);
                        break;
                    case LT:
                        ew.lt(column, value);
                        break;
                    case LE:
                        ew.le(column, value);
                        break;
                    case BETWEEN:
                        ew.between(column, cond.getBegin(), cond.getEnd());
                        break;
                    default:
                        break;
                }
            }
        });
    }

}
