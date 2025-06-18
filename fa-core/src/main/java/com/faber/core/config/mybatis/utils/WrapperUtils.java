package com.faber.core.config.mybatis.utils;

import cn.hutool.core.util.ClassUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.ReflectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.annotation.IEnum;
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
import java.util.*;

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

                    switch (opr) {
                        case "min":
                            ew.ge(fieldName, entry.getValue());
                            break;
                        case "max":
                            ew.le(fieldName, entry.getValue());
                            break;
                        case "likeLeft":
                            ew.likeLeft(fieldName, entry.getValue());
                            break;
                        case "likeRight":
                            ew.likeRight(fieldName, entry.getValue());
                            break;
                        case "in":
                            if (entry.getValue() != null && StringUtils.isNotEmpty(entry.getValue().toString())) {
                                List list = (List) entry.getValue();
                                ew.in(list.size() > 0, fieldName, list);
                            }
                            break;
                        case "notIn":
                            if (entry.getValue() != null && StringUtils.isNotEmpty(entry.getValue().toString())) {
                                List list = (List) entry.getValue();
                                ew.notIn(list.size() > 0, fieldName, list);
                            }
                            break;
                        case "gt":
                            ew.gt(fieldName, entry.getValue());
                            break;
                        case "lt":
                            ew.lt(fieldName, entry.getValue());
                            break;
                    }

                    continue;
                }

                if (StrUtil.isEmpty(entry.getValue().toString())) continue;

                // TO-DO: 增加注解方式，有的string属性需要强制指定为equals查询
                Field field = ReflectUtil.getField(clazz, entry.getKey());
                boolean forceEqual = judgeFieldEqual(field);

//                if (field == null) {
//                    log.warn("No field {} Found", entry.getKey());
//                    continue;
//                }

                String fieldColumn = StrUtil.toUnderlineCase(entry.getKey());
                if (forceEqual) {
                    ew.eq(fieldColumn, entry.getValue());
                } else {
                    if (entry.getValue() instanceof Boolean) {
                        ew.eq(fieldColumn, entry.getValue());
                    } else {
                        ew.like(fieldColumn, SqlUtils.filterLikeValue(StrUtil.toString(entry.getValue())));
                    }
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
                        ew.or().like(fieldColumn, SqlUtils.filterLikeValue(queryParams.getSearch()));
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

        List<Sorter> sorterList = queryParams.getSorterInfo();
        if (sorterList != null && !sorterList.isEmpty()) {
            for (Sorter sorter : sorterList) {
                wrapper.orderBy(true, sorter.isAsc(), sorter.getField());
            }
        }

        return wrapper;
    }

    /**
     * 判断field是否是等于=查询
     * @param field
     * @return
     */
    private static boolean judgeFieldEqual(Field field) {
        if (field == null) return false;

        // SqlEquals注解
        if (field.getAnnotation(SqlEquals.class) != null) return true;

        // Enum枚举类型
        if (ClassUtil.isEnum(field.getType())) return true;

        if (field.getType() == Date.class) return true;

        return false;
    }

    private static List<String> valueToList(Object value) {
        List<String> list = new ArrayList<>();
        if (value instanceof List) {
            list = (List<String>) value;
        } else {
            list = Arrays.asList(ObjectUtil.toString(value).split("[,，]"));
        }
        return list;
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
                        ew.eq(column, value);
                        break;
                    case NE:
                        ew.ne(column, value);
                        break;
                    case IN: {
                        List<String> list = valueToList(value);
                        ew.in(list.size() > 0, column, list);
                    } break;
                    case NOT_IN: {
                        List<String> list = valueToList(value);
                        ew.notIn(list.size() > 0, column, list);
                    } break;
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
                    case IS_NOT_NULL:
                        ew.isNotNull(column);
                        break;
                    case IS_NULL:
                        ew.isNull(column);
                        break;
                    default:
                        break;
                }
            }
        });
    }

}
