package com.faber.common.biz;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.ReflectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.ace.cache.api.CacheAPI;
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.faber.admin.entity.Config;
import com.faber.admin.mapper.ConfigMapper;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.config.BaseEnumConverter;
import com.faber.common.config.LocalDateTimeConverter;
import com.faber.common.context.BaseContextHandler;
import com.faber.common.enums.DelStateEnum;
import com.faber.common.exception.BuzzException;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.util.EasyExcelUtils;
import com.faber.common.vo.Query;
import com.faber.common.util.SpringUtil;
import com.faber.common.util.SqlUtils;
import com.faber.common.vo.Sorter;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.net.URLEncoder;
import java.util.*;

/**
 * 业务Service父类
 * 1. 实现MyBatis的一些通用查询方法
 * <p>
 * Version 1.0.0
 */
public abstract class BaseBiz<M extends BaseMapper<T>, T> extends ServiceImpl<M, T> {

    protected final Logger _logger = LoggerFactory.getLogger(this.getClass());

    private ConfigMapper configMapper;

    @Autowired
    private CacheAPI cacheAPI;

    /**
     * 校验Entity是否有效
     */
    @Deprecated
    public void checkBeanValid(BaseDelEntity bean) {
        if (bean == null || bean.getDelState() == DelStateEnum.DELETED) {
            throw new BuzzException("No Data Found");
        }
    }

    public Class<T> getEntityClass() {
        Class<T> clazz = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
        return clazz;
    }

    public List<T> mineList(Map<String, Object> params) {
        params.put("crtUser", getCurrentUserId());
        return this.list(params);
    }

    /**
     * {@link Query}自定义预先处理
     *
     * @param query
     */
    protected void preProcessQuery(Query query) {}

    public QueryWrapper<T> parseQuery(Query query) {
        Class<T> clazz = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
        return this.parseQuery(query, clazz);
    }

    public QueryWrapper<T> parseQuery(Query query, Class clazz) {
        this.preProcessQuery(query);

        QueryWrapper<T> wrapper = new QueryWrapper<>();

//        Example example = new Example(clazz);
        // key-value模式查询条件组装

        wrapper.and(query.size() > 0, ew -> {
            for (Map.Entry<String, Object> entry : query.entrySet()) {
                // xxx#$min，xxx#$max 类型的key，为最小值、最大值判定
                String key = entry.getKey();
                if (key.contains("#$")) {
                    String fieldName = key.substring(0, key.indexOf("#$"));
                    fieldName = StrUtil.toUnderlineCase(fieldName);
                    String opr = key.substring(key.indexOf("#$") + 2);
                    if ("min".equals(opr)) {
                        ew.ge(fieldName, entry.getValue());
                    } else if ("max".equals(opr)) {
                        ew.le(fieldName, entry.getValue());
                    } else if ("in".equals(opr)) {
                        if (entry.getValue() != null && StringUtils.isNotEmpty(entry.getValue().toString())) {
//                            String[] ss = ;
                            List list = (List) entry.getValue();
                            ew.in(list.size() > 0, fieldName, list);
                        }
                    }
                    continue;
                }

                // TO-DO: 增加注解方式，有的string属性需要强制指定为equals查询
                Class matchClazz = clazz;
                boolean fieldFind = false;
                boolean forceEqual = false;
                while (matchClazz != null && !fieldFind) {
                    try {
                        // 获得字段注解
                        Field field = matchClazz.getDeclaredField(entry.getKey());
                        fieldFind = true;
                        SqlEquals annotation = field.getAnnotation(SqlEquals.class);
                        if (annotation != null) {
                            forceEqual = true;
                        }
                    } catch (NoSuchFieldException e) {
//                        e.printStackTrace();
                        fieldFind = false;
                    }

                    // 向上查找父类
                    matchClazz = matchClazz.getSuperclass();
                }

                if (!fieldFind) {
                    _logger.warn("No field {} Found", entry.getKey());
                    continue;
                }

                if (StrUtil.isNotEmpty(entry.getValue().toString())) {
                    String fieldColumn = StrUtil.toUnderlineCase(entry.getKey());
                    if (forceEqual) {
                        ew.eq(fieldColumn, entry.getValue());
                    } else {
                        ew.like(fieldColumn, SqlUtils.filterLikeValue(StrUtil.toString(entry.getValue())));
                    }
                }
            }
        });

        // 单查询字段
        /*
        where 1 = 1`
        AND (field1 LIKE '%ss[0]%' OR field2 LIKE '%ss[0]%')
         */
//        if (StringUtils.isNotEmpty(query.getSearch())) {
//            wrapper.and(ew -> {
//                for (Field field : clazz.getDeclaredFields()) {
//                    SqlSearch annotation = field.getAnnotation(SqlSearch.class);
//                    Column columnAnnotation = field.getAnnotation(Column.class);
//                    if (annotation != null) {
//                        ew.like(columnAnnotation.name(), SqlUtils.filterLikeValue(query.getSearch()));
//                    }
//                }
//            });
//        }

        // 高级查询-过滤条件List
        if (query.getConditionList() != null && query.getConditionList().size() > 0) {
            for (Map map : query.getConditionList()) {
                String type = (String) map.get("type");
                List<Map> condList = (List<Map>) map.get("condList");
                this.processConditionList(type, condList, wrapper);
            }
        }

        // sceneId 场景ID查询
        if (query.getSceneId() != null && query.getSceneId() > 0) {
            if (this.configMapper == null) {
                this.configMapper = SpringUtil.getBean(ConfigMapper.class);
            }
            Config config = configMapper.selectById(query.getSceneId());
            if (config != null) {
                try {
                    List<Map> list = JSONUtil.parseArray(config.getData()).toList(Map.class);
                    for (Map map : list) {
                        String type = (String) map.get("type");
                        List<Map> condList = (List<Map>) map.get("condList");
                        this.processConditionList(type, condList, wrapper);
                    }
                } catch (Exception e) {
                    _logger.error("config: {}", config);
                    _logger.error(e.getMessage(), e);
                    throw new BuzzException("解析条件失败，请联系管理员");
                }
            }
        }

        Sorter sorter = query.getSorterInfo();
        if (sorter != null) {
            wrapper.orderBy(true, sorter.isAsc(), sorter.getField());
        }

        return wrapper;
    }

    /**
     *
     * @param type 组合类型：and、or
     * @param conditionList
     * @param wrapper
     */
    private void processConditionList(String type, List<Map> conditionList, QueryWrapper<T> wrapper) {
        wrapper.and(conditionList.size() > 0,ew -> {
            for (Map cond : conditionList) {
                String key = MapUtils.getString(cond, "key");
                key = StrUtil.toUnderlineCase(key);

                String opr = MapUtils.getString(cond, "opr");
                Object value = MapUtils.getObject(cond, "value");
                String begin = MapUtils.getString(cond, "begin");
                String end = MapUtils.getString(cond, "end");

                if (StringUtils.isNoneEmpty(key, opr)) {
//                value = SqlUtils.filterLikeValue(value);
                    if ("or".equalsIgnoreCase(type)) {
                        ew.or();
                    }

                    switch (opr) {
                        case "equal": {
                            ew.or().eq(key, value);
                        } break;
                        case "not_equal": {
                            ew.ne(key, value);
                        } break;
                        case "in": {
                            List<String> list = Arrays.asList(ObjectUtil.toString(value).split("，"));
                            ew.in(list.size() > 0, key, list);
                        } break;
                        case "contain": {
                            ew.like(key, SqlUtils.filterLikeValue(ObjectUtil.toString(value)));
                        } break;
                        case "not_contain": {
                            ew.notLike(key, SqlUtils.filterLikeValue(ObjectUtil.toString(value)));
                        } break;
                        case "start_contain": {
                            ew.likeLeft(key, SqlUtils.filterLikeValue(ObjectUtil.toString(value)));
                        } break;
                        case "end_contain": {
                            ew.likeRight(key, SqlUtils.filterLikeValue(ObjectUtil.toString(value)));
                        } break;
                        case "greater": {
                            ew.gt(key, value);
                        } break;
                        case "greater_equal": {
                            ew.ge(key, value);
                        } break;
                        case "less": {
                            ew.lt(key, value);
                        } break;
                        case "less_equal": {
                            ew.le(key, value);
                        } break;
                        case "between": {
                            ew.between(key, begin, end);
                        } break;
                    }
                }
            }
        });
    }

    public TableResultResponse<T> selectPageByQuery(Query query) {
        QueryWrapper<T> wrapper = parseQuery(query);
        if (query.getLimit() > 1000) throw new BuzzException("查询结果数量大于1000，请缩小查询范围");
        Page<T> page = new Page<>(query.getPage(), query.getLimit());
        Page<T> result =  super.page(page, wrapper);
        return new TableResultResponse<T>(result);
    }

    public List<T> list(Map<String, Object> params) {
        Query query = new Query(params);
        QueryWrapper<T> wrapper = parseQuery(query);
        return super.list(wrapper);
    }

    /**
     * 根据查询条件，获取下载Excel的数据List
     *
     * @param params
     * @return
     */
    public List<T> selectExportExcelList(Map<String, Object> params) {
        Query query = new Query(params);
        QueryWrapper<T> wrapper = parseQuery(query);
        long count = super.count(wrapper);
        if (count > 10000) throw new BuzzException("查询结果数量大于10000，请缩小查询范围");
        return super.list(wrapper);
    }

    /**
     * 根据组合查询条件，下载Excel
     *
     * @param params
     * @throws IOException
     */
    public void exportExcel(Map<String, Object> params) throws IOException {
        List<T> list = this.selectExportExcelList(params);
        Class<T> clazz = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
        this.sendFileExcel(clazz, list);
    }

    /**
     * response写入下载Excel文件流
     *
     * @param clazz
     * @param list
     * @throws IOException
     */
    protected void sendFileExcel(Class<T> clazz, List<T> list) throws IOException {
        HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();

        FaberModalName anno = clazz.getAnnotation(FaberModalName.class);

        String fileName = DateUtil.now() + "";
        if (anno != null) {
            fileName = anno.name() + "_" + fileName;
        }

        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        response.setContentType("application/vnd.ms-excel");
        response.setCharacterEncoding("utf-8");
        // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
        fileName = URLEncoder.encode(fileName, "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
        response.setHeader("faber-filename", fileName + ".xlsx");

        EasyExcel
                .write(response.getOutputStream(), clazz)
                .registerWriteHandler(EasyExcelUtils.genHeaderWriteStyle())
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
//                .registerConverter(new BaseEnumConverter())
//                .registerConverter(new LocalDateTimeConverter())
                .sheet("Sheet1")
                .doWrite(list);
    }

    public String getCurrentName() {
        return BaseContextHandler.getName();
    }

    public String getCurrentUserName() {
        return BaseContextHandler.getUsername();
    }

    public String getCurrentUserId() {
        return BaseContextHandler.getUserID();
    }

    protected ObjectRestResponse<Boolean> ok() {
        return new ObjectRestResponse<Boolean>().rel(true);
    }

    protected ObjectRestResponse<Object> ok(Object data) {
        return new ObjectRestResponse<>().data(data);
    }

    /**
     * 删除所有权限缓存，适用情景：
     */
    protected void clearMenuAndElementCache() {
        cacheAPI.removeByPre("permission");
    }

    /**
     * 删除用户缓存
     */
    protected void clearUserCache(String userId) {
        cacheAPI.removeByPre("user:" + userId);
        cacheAPI.removeByPre("permission:menu:u:" + userId);
        cacheAPI.removeByPre("permission:ele:u:" + userId);
    }

    protected boolean hasField(String fieldName) {
        return ReflectUtil.hasField(getEntityClass(), fieldName);
    }

}
