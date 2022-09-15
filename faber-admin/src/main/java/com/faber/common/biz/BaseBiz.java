package com.faber.common.biz;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.ReflectUtil;
import cn.hutool.json.JSONUtil;
import com.ace.cache.api.CacheAPI;
import com.alibaba.excel.EasyExcel;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.context.BaseContextHandler;
import com.faber.common.exception.BuzzException;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.util.*;
import com.faber.admin.entity.Config;
import com.faber.admin.entity.Element;
import com.faber.admin.entity.Menu;
import com.faber.admin.mapper.ConfigMapper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import tk.mybatis.mapper.common.Mapper;
import tk.mybatis.mapper.entity.Example;

import javax.persistence.Column;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * 业务Service父类
 * 1. 实现MyBatis的一些通用查询方法
 * <p>
 * Version 1.0.0
 */
public abstract class BaseBiz<M extends Mapper<T>, T> {

    protected final Logger _logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    protected M mapper;

    private ConfigMapper configMapper;

    @Autowired
    private CacheAPI cacheAPI;

    /**
     * 校验Entity是否有效
     */
    public void checkBeanValid(BaseDelEntity bean) {
        if (bean == null || BaseDelEntity.DEL_STATE.DELETED.equals(bean.getDelState())) {
            throw new BuzzException("No Data Found");
        }
    }

    public Class<T> getEntityClass() {
        Class<T> clazz = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
        return clazz;
    }

    public void setMapper(M mapper) {
        this.mapper = mapper;
    }

    public M getMapper() {
        return mapper;
    }

    public T selectOne(T entity) {
        return mapper.selectOne(entity);
    }

    public T selectById(Object id) {
        return mapper.selectByPrimaryKey(id);
    }

    public List<T> selectList(T entity) {
        return mapper.select(entity);
    }

    public List<T> selectListAllLogical() {
        Class<T> clazz = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
        Example example = new Example(clazz);
        example.createCriteria().andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE);
        return mapper.selectByExample(example);
    }

    public List<T> selectListAll() {
        return mapper.selectAll();
    }

    public Long selectCount(T entity) {
        return new Long(mapper.selectCount(entity));
    }

    public void insert(T entity) {
        EntityUtils.setCreateAndUpdateInfo(entity);
        mapper.insert(entity);
    }

    public void insertSelective(T entity) {
        EntityUtils.setCreateAndUpdateInfo(entity);
        mapper.insertSelective(entity);
    }

    public void batchInsert(List<T> entityList) {
        for (T t : entityList) {
            this.insertSelective(t);
        }
    }

    public void delete(T entity) {
        mapper.delete(entity);
    }

    public void deleteById(Object id) {
        mapper.deleteByPrimaryKey(id);
    }

    public void logicDeleteById(Object id) {
        T entity = mapper.selectByPrimaryKey(id);
        EntityUtils.setLogicDeleteInfo(entity);
        mapper.updateByPrimaryKey(entity);
    }

    public void batchDelete(Map<String, Object> params) {
        List<Object> ids = (List<Object>) params.get("ids");

        ids.forEach(id -> {
            this.deleteById(id);
        });
    }

    public void batchLogicDelete(Map<String, Object> params) {
        List<Object> ids = (List<Object>) params.get("ids");

        ids.forEach(id -> {
            this.logicDeleteById(id);
        });
    }

    public void updateById(T entity) {
        EntityUtils.setUpdatedInfo(entity);
        mapper.updateByPrimaryKey(entity);
    }

    public void updateSelectiveById(T entity) {
        EntityUtils.setUpdatedInfo(entity);
        mapper.updateByPrimaryKeySelective(entity);
    }

    public List<T> selectByExample(Object example) {
        return mapper.selectByExample(example);
    }

    public int selectCountByExample(Object example) {
        return mapper.selectCountByExample(example);
    }

    public List<T> mineList(Map<String, Object> params) {
        //查询列表数据
        params.put("crtUser", getCurrentUserId());
        params.put("delState", BaseDelEntity.DEL_STATE.AVAILABLE);
        Query query = new Query(params);
        return this.selectByQuery(query);
    }

    /**
     * {@link Query}自定义预先处理
     *
     * @param query
     */
    protected void preProcessQuery(Query query) {
    }


    protected Example parseQuery(Query query) {
        Class<T> clazz = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
        return this.parseQuery(query, clazz);
    }

    protected Example parseQuery(Query query, Class clazz) {
        this.preProcessQuery(query);
        Example example = new Example(clazz);
        // key-value模式查询条件组装
        if (query.entrySet().size() > 0) {
            Example.Criteria criteria = example.and();
            for (Map.Entry<String, Object> entry : query.entrySet()) {
                // xxx#$min，xxx#$max 类型的key，为最小值、最大值判定
                String key = entry.getKey();
                if (key.contains("#$")) {
                    String fieldName = key.substring(0, key.indexOf("#$"));
                    String opr = key.substring(key.indexOf("#$") + 2);
                    if ("min".equals(opr)) {
                        criteria.andGreaterThanOrEqualTo(fieldName, entry.getValue());
                    } else if ("max".equals(opr)) {
                        criteria.andLessThanOrEqualTo(fieldName, entry.getValue());
                    } else if ("in".equals(opr)) {
                        if (entry.getValue() != null && StringUtils.isNotEmpty(entry.getValue().toString())) {
//                            String[] ss = ((String) entry.getValue()).split(",");
                            criteria.andIn(fieldName, (Iterable) entry.getValue());
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

                if (entry.getValue() != null && StringUtils.isNotEmpty(entry.getValue().toString())) {
                    if (forceEqual) {
                        criteria.andEqualTo(entry.getKey(), entry.getValue());
                    } else {
                        String[] ss = entry.getValue().toString().split("(\\s|,|，)");
                        Example.Criteria criteriaAnd = example.and();
                        for (String s : ss) {
                            criteriaAnd.andLike(entry.getKey(), "%" + SqlUtils.filterLikeValue(s) + "%");
                        }
                    }
                }
            }
        }

        // 单查询字段
        /*
        where 1 = 1`
        AND (
            (field1 LIKE '%ss[0]%' AND field1 LIKE '%ss[0]%')
            OR
            (field2 LIKE '%ss[0]%' AND field2 LIKE '%ss[0]%')
        )
         */
        if (StringUtils.isNotEmpty(query.getSearch())) {
            Example.Criteria criteria = example.and();

            String[] ss = query.getSearch().split("(\\s|,|，)");
            if (ss.length > 0) {
                for (Field field : clazz.getDeclaredFields()) {
                    SqlSearch annotation = field.getAnnotation(SqlSearch.class);
                    Column columnAnnotation = field.getAnnotation(Column.class);
                    if (annotation != null) {
                        // 拼接查询
                        List<String> conditionList = new ArrayList<>();
                        for (String s : ss) {
                            conditionList.add(" " + columnAnnotation.name() + " LIKE '%" + SqlUtils.filterLikeValue(s) + "%' ");
                        }
                        if (conditionList.size() > 0) {
                            criteria.orCondition("(" + ArrayUtil.join(conditionList.toArray(new String[]{}), " AND ") + ")");
                        }
//                        criteria.orCondition(field.getName(), ".*" + ArrayUtil.join(ss, ".*") + ".*");
                    }
                }
            }
        }

        // 高级查询-过滤条件List
        if (query.getConditionList() != null && query.getConditionList().size() > 0) {
            for (Map map : query.getConditionList()) {
                String type = (String) map.get("type");
                List<Map> condList = (List<Map>) map.get("condList");
                this.processConditionList(type, condList, example.and());
            }
        }

        // sceneId 场景ID查询
        if (query.getSceneId() != null && query.getSceneId() > 0) {
            if (this.configMapper == null) {
                this.configMapper = SpringUtil.getBean(ConfigMapper.class);
            }
            Config config = configMapper.selectByPrimaryKey(query.getSceneId());
            if (config != null) {
                try {
                    List<Map> list = JSONUtil.parseArray(config.getData()).toList(Map.class);
                    for (Map map : list) {
                        String type = (String) map.get("type");
                        List<Map> condList = (List<Map>) map.get("condList");
                        this.processConditionList(type, condList, example.and());
                    }
                } catch (Exception e) {
                    _logger.error("config: {}", config);
                    _logger.error(e.getMessage(), e);
                    throw new BuzzException("解析条件失败，请联系管理员");
                }
            }
        }

        example.setOrderByClause(query.getSorter());
        return example;
    }

    /**
     *
     * @param type 组合类型：and、or
     * @param conditionList
     * @param criteria
     */
    private void processConditionList(String type, List<Map> conditionList, Example.Criteria criteria) {
        conditionList.forEach(cond -> {
            String key = MapUtils.getString(cond, "key");
            String opr = MapUtils.getString(cond, "opr");
            Object value = MapUtils.getObject(cond, "value");
            String begin = MapUtils.getString(cond, "begin");
            String end = MapUtils.getString(cond, "end");

            if (StringUtils.isNoneEmpty(key, opr)) {
//                value = SqlUtils.filterLikeValue(value);
                switch (opr) {
                    case "equal": {
                        switch (type) {
                            case "and": criteria.andEqualTo(key, value); break;
                            case "or":  criteria.orEqualTo(key, value); break;
                        }
                    } break;
                    case "not_equal": {
                        switch (type) {
                            case "and": criteria.andNotEqualTo(key, value); break;
                            case "or":  criteria.orNotEqualTo(key, value); break;
                        }
                    } break;
                    case "in": {
                        String[] valueSs = ObjectUtil.toString(value).split("，");
                        switch (type) {
                            case "and": criteria.andIn(key, Arrays.asList(valueSs)); break;
                            case "or":  criteria.orIn(key, Arrays.asList(valueSs)); break;
                        }
                    } break;
                    case "contain": {
                        switch (type) {
                            case "and": criteria.andLike(key, "%" + SqlUtils.filterLikeValue(ObjectUtil.toString(value)) + "%"); break;
                            case "or":  criteria.orLike(key, "%" + SqlUtils.filterLikeValue(ObjectUtil.toString(value)) + "%"); break;
                        }
                    } break;
                    case "not_contain": {
                        switch (type) {
                            case "and": criteria.andNotLike(key, "%" + SqlUtils.filterLikeValue(ObjectUtil.toString(value)) + "%"); break;
                            case "or":  criteria.orNotLike(key, "%" + SqlUtils.filterLikeValue(ObjectUtil.toString(value)) + "%"); break;
                        }
                    } break;
                    case "start_contain": {
                        switch (type) {
                            case "and": criteria.andLike(key, SqlUtils.filterLikeValue(ObjectUtil.toString(value)) + "%"); break;
                            case "or":  criteria.orLike(key, SqlUtils.filterLikeValue(ObjectUtil.toString(value)) + "%"); break;
                        }
                    } break;
                    case "end_contain": {
                        switch (type) {
                            case "and": criteria.andLike(key, "%" + SqlUtils.filterLikeValue(ObjectUtil.toString(value))); break;
                            case "or":  criteria.orLike(key, "%" + SqlUtils.filterLikeValue(ObjectUtil.toString(value))); break;
                        }
                    } break;
                    case "greater": {
                        switch (type) {
                            case "and": criteria.andGreaterThan(key, value); break;
                            case "or":  criteria.orGreaterThan(key, value); break;
                        }
                    } break;
                    case "greater_equal": {
                        switch (type) {
                            case "and": criteria.andGreaterThanOrEqualTo(key, value); break;
                            case "or":  criteria.orGreaterThanOrEqualTo(key, value); break;
                        }
                    } break;
                    case "less": {
                        switch (type) {
                            case "and": criteria.andLessThan(key, value); break;
                            case "or":  criteria.orLessThan(key, value); break;
                        }
                    } break;
                    case "less_equal": {
                        switch (type) {
                            case "and": criteria.andLessThanOrEqualTo(key, value); break;
                            case "or":  criteria.orLessThanOrEqualTo(key, value); break;
                        }
                    } break;
                    case "between": {
                        switch (type) {
                            case "and": criteria.andBetween(key, begin, end); break;
                            case "or":  criteria.orBetween(key, begin, end); break;
                        }
                    } break;
                }
            }
        });
    }

    public int count(Map<String, Object> params) {
        Query query = new Query(params);
        Example example = parseQuery(query);
        return mapper.selectCountByExample(example);
    }

    public List<T> selectByQuery(Query query) {
        Example example = parseQuery(query);
        int count = mapper.selectCountByExample(example);
        if (count > 1000) throw new BuzzException("查询结果数量大于1000，请缩小查询范围");
        return mapper.selectByExample(example);
    }

    public TableResultResponse<T> selectPageByQuery(Query query) {
        Example example = parseQuery(query);
        if (query.getLimit() > 1000) throw new BuzzException("查询结果数量大于1000，请缩小查询范围");
        Page<Object> result = PageHelper.startPage(query.getPage(), query.getLimit());
        List<T> list = mapper.selectByExample(example);
        return new TableResultResponse<T>(new PageInfo<>(list));
    }

    /**
     * 根据查询条件，获取下载Excel的数据List
     *
     * @param params
     * @return
     */
    public List<T> selectExportExcelList(Map<String, Object> params) {
        //查询列表数据
        Query query = new Query(params);
        Example example = parseQuery(query);
        int count = mapper.selectCountByExample(example);
        if (count > 500000) throw new BuzzException("查询结果数量大于500000，请缩小查询范围");
        List<T> list = mapper.selectByExample(example);
        return list;
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

        String fileName = System.currentTimeMillis() + "";
        if (anno != null) {
            fileName = anno.name();
        }

        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        response.setContentType("application/vnd.ms-excel");
        response.setCharacterEncoding("utf-8");
        // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
        fileName = URLEncoder.encode(fileName, "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
        response.setHeader("faber-filename", fileName + ".xlsx");

        EasyExcel.write(response.getOutputStream(), clazz).registerWriteHandler(EasyExcelUtils.genHeaderWriteStyle()).sheet("模板").doWrite(list);
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

    protected ObjectRestResponse ok() {
        return new ObjectRestResponse().rel(true);
    }

    protected ObjectRestResponse ok(Object data) {
        return new ObjectRestResponse().data(data);
    }

    /**
     * 删除所有权限缓存，适用情景：
     * 1. 菜单{@link Menu}CRUD
     * 2. 资源{@link Element}CRUD
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

    /**
     * 通用Tree类型数据向下查询
     *
     * @param id 要查询的根节点ID
     * @return 返回要查询的根节点向下所有节点的平铺List（包含id节点）
     */
    public List<T> findAllChildren(Object id) {
        List<T> list = new ArrayList<>();

        // 查询顶部节点
        T topItem = mapper.selectByPrimaryKey(id);
        if (topItem == null) return new ArrayList<>();

        if (topItem instanceof BaseDelEntity) {
            checkBeanValid((BaseDelEntity) topItem);
        }

        list.add(topItem);

        Object topItemId = ReflectUtil.getFieldValue(topItem, "id");
        List<T> children = this.findChildren(topItemId);
        list.addAll(children);

        return list;
    }

    /**
     * 通用Tree类型数据向下递归查询
     *
     * @param parentId 要查询的父节点ID
     * @return 返回要查询的根节点向下所有节点的平铺List（不包含parentId节点）
     */
    public List<T> findChildren(Object parentId) {
        List<T> list = new ArrayList<>();
        Class<T> clazz = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
        Example example = new Example(clazz);
        example.createCriteria().andEqualTo("parentId", parentId);
        if (ReflectUtil.hasField(clazz, "delState")) {
            example.and().andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE);
        }
        List<T> children = mapper.selectByExample(example);
        if (children != null && !children.isEmpty()) {
            list.addAll(children);
            children.forEach(child -> {
                Object childItemId = ReflectUtil.getFieldValue(child, "id");
                list.addAll(findChildren(childItemId));
            });
        }
        return list;
    }

    protected Example.Criteria filterDelState(Example.Criteria criteria) {
        return criteria.andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE);
    }

    protected boolean hasField(String fieldName) {
        return ReflectUtil.hasField(getEntityClass(), fieldName);
    }

}
