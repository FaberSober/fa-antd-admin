package com.faber.core.web.biz;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ReflectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.extra.spring.SpringUtil;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.TableInfo;
import com.baomidou.mybatisplus.core.metadata.TableInfoHelper;
import com.baomidou.mybatisplus.core.toolkit.Assert;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.faber.core.annotation.*;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import com.faber.core.config.mybatis.utils.WrapperUtils;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.exception.BuzzException;
import com.faber.core.service.ConfigSceneService;
import com.faber.core.service.DictService;
import com.faber.core.service.StorageService;
import com.faber.core.utils.FaEnumUtils;
import com.faber.core.utils.FaExcelUtils;
import com.faber.core.vo.excel.CommonImportExcelReqVo;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.ConditionGroup;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.vo.utils.DictOption;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.dromara.x.file.storage.core.FileInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.*;

/**
 * 业务Service父类
 * 1. 实现MyBatis的一些通用查询方法
 * <p>
 * Version 1.0.0
 */
public abstract class BaseBiz<M extends FaBaseMapper<T>, T> extends ServiceImpl<M, T> {

    protected final Logger _logger = LoggerFactory.getLogger(this.getClass());
    protected final int DEFAULT_PAGE_SIZE = 1000;

    private ConfigSceneService configSceneService;
    private DictService dictService;
    private StorageService storageService;


    /**
     * 在save、update之后做一些同步数据操作
     *
     * @param entity
     */
    protected void afterChange(T entity) {
    }

    /**
     * 在save、updateById之前对bean做一些操作
     *
     * @param entity
     */
    protected void saveBefore(T entity) {
    }

    /**
     * 在save之后对bean做一些操作
     *
     * @param entity
     */
    protected void afterSave(T entity) {
    }

    @Override
    public boolean save(T entity) {
        saveBefore(entity);
        boolean flag = super.save(entity);
        afterSave(entity);
        afterChange(entity);
        return flag;
    }

    @Override
    public boolean saveBatch(Collection<T> entityList) {
        if (entityList == null || entityList.isEmpty()) return true;
        for (T entity : entityList) {
            saveBefore(entity);
        }
        return super.saveBatch(entityList);
    }

    /**
     * 在updateById之后对bean做一些操作
     *
     * @param entity
     */
    protected void afterUpdate(T entity) {
    }

    @Override
    public boolean updateById(T entity) {
        saveBefore(entity);
        boolean flag = super.updateById(entity);
        afterUpdate(entity);
        afterChange(entity);
        return flag;
    }

    /**
     * 在removeById之后对bean做一些操作
     *
     * @param id
     */
    protected void afterRemove(Serializable id) {
    }

    protected void afterRemove(List<Serializable> ids) {
        for (Serializable id : ids) {
            afterRemove(id);
        }
    }

    @Override
    public boolean removeById(Serializable id) {
        boolean flag = super.removeById(id);
        afterRemove(id);
        return flag;
    }

    public <ID extends Serializable> List<T> getByIds(List<ID> ids) {
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<>();
        }

        QueryWrapper<T> wrapper = new QueryWrapper<>();
        wrapper.in("id", ids);
        List<T> list = super.list(wrapper);
        // sort by ids origin order
        CollUtil.sort(list, (o1, o2) -> {
            int o1IdIndex = ids.indexOf(ReflectUtil.getFieldValue(o1, "id"));
            int o2IdIndex = ids.indexOf(ReflectUtil.getFieldValue(o2, "id"));
            return o1IdIndex - o2IdIndex;
        });
        return list;
    }

    public List<T> mineList(QueryParams query) {
        query.getQuery().put("crtUser", getCurrentUserId());
        return this.list(query);
    }

    /**
     * {@link QueryParams}自定义预先处理
     *
     * @param query
     */
    protected void preProcessQuery(QueryParams query) {
    }

    public QueryWrapper<T> parseQuery(QueryParams query) {
        this.preProcessQuery(query);

        this.processSceneId(query);

        return WrapperUtils.parseQuery(query, getEntityClass());
    }

    /**
     * sceneId 场景ID查询-追加到条件组中
     *
     * @param query
     */
    protected void processSceneId(QueryParams query) {
        if (query.getSceneId() == null || query.getSceneId() == 0) {
            return;
        }

        if (configSceneService == null) {
            configSceneService = SpringUtil.getBean(ConfigSceneService.class);
        }
        try {
            ConditionGroup[] configData = configSceneService.getConfigDataById(query.getSceneId());
            if (configData != null) {
                query.addConditionGroupList(ListUtil.toList(configData));
            }
        } catch (Exception e) {
            _logger.error(e.getMessage(), e);
            throw new BuzzException("解析条件失败，请联系管理员");
        }
    }

    public T getDetailById(Serializable id) {
        T item = super.getById(id);
        this.decorateOne(item);
        return item;
    }

    public void decorateOne(T i) {
    }

    public void decorateList(List<T> list) {
        list.forEach(this::decorateOne);
    }

    public TableRet<T> selectPageByQuery(QueryParams query) {
        QueryWrapper<T> wrapper = parseQuery(query);
        if (query.getPageSize() > 1000) {
            throw new BuzzException("查询结果数量大于1000，请缩小查询范围");
        }

        // page query
        Page<T> page = new Page<>(query.getCurrent(), query.getPageSize());
        Page<T> result = super.page(page, wrapper);
        TableRet<T> table = new TableRet<T>(result);

        // add dict, enum options
        this.addEnumOptions(table, getEntityClass());
        this.addDictOptions(table, getEntityClass());

        // decorate
        decorateList(table.getData().getRows());

        return table;
    }

    /**
     * add enum dict options
     * @param table
     * @param clazz
     */
    public void addEnumOptions(TableRet<?> table, Class<?> clazz) {
        Field[] fields = ReflectUtil.getFields(clazz, field -> IEnum.class.isAssignableFrom(field.getType()));
        for (Field field : fields) {
            table.getData().addDict(field.getName(), FaEnumUtils.toOptions((Class<? extends IEnum<Serializable>>) field.getType()));
        }
    }

    /**
     * add db dict options
     * @param table
     * @param clazz
     */
    public void addDictOptions(TableRet<?> table, Class<?> clazz) {
        if (dictService == null) {
            dictService = SpringUtil.getBean(DictService.class);
        }
        if (dictService == null) {
            throw new BuzzException("DictService not implemented yet");
        }

        Field[] fields = ReflectUtil.getFields(clazz, field -> field.getAnnotation(FaColDict.class) != null);
        for (Field field : fields) {
            FaColDict anno = field.getAnnotation(FaColDict.class);
            List<DictOption<Serializable>> options = dictService.getOptionsByCode(anno.value());
            table.getData().addDict(field.getName(), options);
        }
    }

    public List<T> list(QueryParams query) {
        QueryWrapper<T> wrapper = parseQuery(query);
        long total = super.count(wrapper);
//        if (total > CommonConstants.QUERY_MAX_COUNT) {
//            throw new BuzzException("单次查询列表返回数据不可超过" + CommonConstants.QUERY_MAX_COUNT);
//        }

        int page = (int) Math.ceil(total / (double) DEFAULT_PAGE_SIZE);

        List<T> allList = new ArrayList<>();

        for (int i = 1; i <= page; i++) {
            PageInfo<T> info = PageHelper.startPage(i, DEFAULT_PAGE_SIZE).doSelectPageInfo(() -> super.list(wrapper));
            allList.addAll(info.getList());
        }

        this.decorateList(allList);
        return allList;
    }

    public List<T> listN(QueryParams query, Integer topN) {
        QueryWrapper<T> wrapper = parseQuery(query);
        wrapper.last("limit " + topN);
        List<T> list = super.list(wrapper);
        this.decorateList(list);
        return list;
    }

    /**
     * 根据组合查询条件，下载Excel
     *
     * @param query
     * @throws IOException
     */
    public void exportExcel(QueryParams query) throws IOException {
        List<T> list = this.list(query);
        FaExcelUtils.sendFileExcel(this.getEntityClass(), list);
    }

    /**
     * 下载空Excel，只带有表头，适用于导入文件
     *
     * @throws IOException
     */
    public void exportTplExcel() throws IOException {
        FaExcelUtils.sendFileExcel(this.getEntityClass(), Collections.emptyList());
    }

    /**
     * 在导入Excel的时候，做一些bean属性的校验、补全
     *
     * @param entity
     */
    protected void saveExcelEntity(T entity) {
        if (entity == null) return;

        TableInfo tableInfo = TableInfoHelper.getTableInfo(this.getEntityClass());
        Assert.notNull(tableInfo, "error: can not execute. because can not find cache of TableInfo for entity!");

        String keyProperty = tableInfo.getKeyProperty();
        Assert.notEmpty(keyProperty, "error: can not execute. because can not find column for id from entity!");


        Object idVal = tableInfo.getPropertyValue(entity, tableInfo.getKeyProperty());
        T dbEntity = this.getById((Serializable) idVal);
        if (dbEntity == null) {
            this.save(entity);
        } else {
            this.updateById(entity);
        }
    }

    public File getFileById(String fileId) {
        return getStorageService().getByFileId(fileId);
    }

    public FileInfo getFileInfoById(String fileId) {
        return getStorageService().getFileInfoById(fileId);
    }

    public StorageService getStorageService() {
        if (this.storageService == null) {
            this.storageService = SpringUtil.getBean(StorageService.class);
        }
        return this.storageService;
    }

    public void saveFileBiz(String mainBizId, String bizId, String type, String fileId) {
        getStorageService().saveFileBiz("", "", type, fileId);
    }

    public File getImportFile(CommonImportExcelReqVo reqVo) {
        File file = getFileById(reqVo.getFileId());
        importExcelFileBizSave(reqVo);
        return file;
    }

    public void importExcelFileBizSave(CommonImportExcelReqVo reqVo) {
        // save file save biz
        if (StrUtil.isNotEmpty(reqVo.getBuzzType())) {
            getStorageService().saveFileBiz("", "", reqVo.getBuzzType(), reqVo.getFileId());
        }
    }

    public void importExcel(CommonImportExcelReqVo reqVo) {
        File file = getFileById(reqVo.getFileId());

        // save file save biz
        if (StrUtil.isNotEmpty(reqVo.getBuzzType())) {
            getStorageService().saveFileBiz("", "", reqVo.getBuzzType(), reqVo.getFileId());
        }

        List<T> saveList = new ArrayList<>();
        FaExcelUtils.simpleRead(file, this.getEntityClass(), i -> {
            saveList.add(i);
        });
        this.saveOrUpdateBatch(saveList);
    }

    /**
     * 根据ID查询实体基础信息
     *
     * @param id ID
     * @return
     */
    public T getByIdWithCache(Serializable id) {
        Map<Serializable, T> cache = BaseContextHandler.getCacheMap(getEntityClass());
        if (cache.containsKey(id)) {
            return cache.get(id);
        }
        T entity = super.getById(id);
        if (entity != null) {
            cache.put(id, entity);
        }
        return entity;
    }

    /**
     * 根据ID查询实体详情
     *
     * @param id ID
     * @return
     */
    public T getDetailByIdWithCache(Serializable id) {
        Map<Serializable, T> cache = BaseContextHandler.getCacheMap(getEntityClass());
        if (cache.containsKey(id)) {
            return cache.get(id);
        }
        T entity = super.getById(id);
        if (entity != null) {
            decorateOne(entity);
            cache.put(id, entity);
        }
        return entity;
    }

    public String getCurrentUserId() {
        return BaseContextHandler.getUserId();
    }

    public void removeBatchByIds(List<Serializable> ids) {
        super.removeBatchByIds(ids);
        afterRemove(ids);
    }

    public void removePerById(Serializable id) {
        // 用SQL进行物理删除
        baseMapper.deleteByIdIgnoreLogic(id);
        afterRemove(id);
    }

    @Transactional(
            rollbackFor = {Exception.class}
    )
    public void removePerBatchByIds(List<Serializable> ids) {
        for (Serializable id : ids) {
            this.removePerById(id);
        }
    }

    public void removeByQuery(QueryParams query) {
        QueryWrapper<T> wrapper = parseQuery(query);
        long count = super.count(wrapper);
        if (count > 1000) {
            throw new BuzzException("删除数据超过1000条，请使用批量删除");
        }
        List<T> list = super.list(wrapper);
        super.remove(wrapper);
        List<Serializable> ids = list.stream().map(i -> getEntityId(i)).toList();
        afterRemove(ids);
    }

    public void removeMine() {
        QueryWrapper<T> wrapper = new QueryWrapper<>();
        wrapper.eq("crt_user", getCurrentUserId());
        super.remove(wrapper);
    }

    public String updateValueToStr(Field field, Object value) {
        if (value == null) return "";
        if (IEnum.class.isAssignableFrom(field.getType())) {
            return (String) ReflectUtil.getFieldValue(value, "desc");
        }
        if (value instanceof Date) return DateUtil.formatDateTime((Date) value);
        return StrUtil.toString(value);
    }

    /**
     * 返回实体的父节点，可以子类覆盖重写
     *
     * @param entity
     * @return
     */
    public Serializable getEntityId(T entity) {
        String idField = this.getAnnotationFieldName(TableId.class);
        return (Serializable) ReflectUtil.getFieldValue(entity, idField);
    }

    /**
     * 获取最大的排序
     *
     * @param colName 取最大排序的
     * @return 最大的排序
     */
    public Integer getMaxSort(String colName) {
        QueryWrapper<T> wrapper = new QueryWrapper<>();
        wrapper.orderByDesc(colName);
        wrapper.select(String.format("IFNULL(max(%s), -1) as value", colName));
        List<Map<String, Object>> result = baseMapper.selectMaps(wrapper);
        return Integer.parseInt(result.get(0).get("value") + "");
    }


    /**
     * 获取最大的排序，传入wrapper,在wrapper里增加查询条件
     *
     * @param colName 取最大排序的
     * @return 最大的排序
     */
    public Integer getMaxSort(String colName ,QueryWrapper wrapper) {
        wrapper.orderByDesc(colName);
        wrapper.select(String.format("IFNULL(max(%s), -1) as value", colName));
        List<Map<String, Object>> result = baseMapper.selectMaps(wrapper);
        return Integer.parseInt(result.get(0).get("value") + "");
    }

    /**
     * 获取最大的排序
     *
     * @param colName 取最大排序的
     * @return 最大的排序
     */
    public Integer getMaxSort(QueryWrapper<T> wrapper, String colName) {
        wrapper.orderByDesc(colName);
        wrapper.select(String.format("IFNULL(max(%s), -1) as value", colName));
        List<Map<String, Object>> result = baseMapper.selectMaps(wrapper);
        return Integer.parseInt(result.get(0).get("value") + "");
    }

    /**
     * 返回最上层一条数据，使用limit 1
     *
     * @param wrapper mybatis-plus wrapper
     * @return 最上层一条数据
     */
    public T getTop(LambdaQueryChainWrapper<T> wrapper) {
        return wrapper.last("limit 1").one();
    }

    public T getTopN(LambdaQueryChainWrapper<T> wrapper, Integer n) {
        return wrapper.last("limit " + n).one();
    }

    /**
     * 获取注解对应的实体字段
     *
     * @param annotationClass {@link SqlSorter}\{@link SqlTreeId}\{@link SqlTreeParentId}\{@link SqlTreeName}
     * @param <AT>
     * @return
     */
    public <AT extends Annotation> Field getAnnotationField(Class<AT> annotationClass) {
        for (Field field : getEntityClass().getDeclaredFields()) {
            AT annotation = field.getAnnotation(annotationClass);
            if (annotation != null) {
                return field;
            }
        }
        return null;
    }

    /**
     * 获取注解对应的实体字段名称
     *
     * @param annotationClass {@link SqlSorter}\{@link SqlTreeId}\{@link SqlTreeParentId}\{@link SqlTreeName}
     * @param <AT>
     * @return
     */
    public <AT extends Annotation> String getAnnotationFieldName(Class<AT> annotationClass) {
        Field field = getAnnotationField(annotationClass);
        if (field == null) {
            String msg = String.format("%1$s类未设置@%2$s注解，未能查找到排序字段，请确认代码。", getEntityClass().getName(), annotationClass.getName());
            _logger.error(msg);
            throw new BuzzException(msg);
        }
        return field.getName();
    }

}
