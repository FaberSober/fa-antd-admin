package com.faber.common.biz;

import cn.hutool.core.date.DateUtil;
import cn.hutool.extra.spring.SpringUtil;
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.faber.admin.entity.Config;
import com.faber.admin.mapper.ConfigMapper;
import com.faber.common.annotation.FaModalName;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.context.BaseContextHandler;
import com.faber.common.enums.DelStateEnum;
import com.faber.common.exception.BuzzException;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.mybatis.WrapperUtils;
import com.faber.common.util.EasyExcelUtils;
import com.faber.common.vo.Query;
import com.faber.common.vo.query.ConditionGroup;
import com.faber.common.vo.query.QueryParams;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.net.URLEncoder;
import java.util.List;

/**
 * 业务Service父类
 * 1. 实现MyBatis的一些通用查询方法
 * <p>
 * Version 1.0.0
 */
public abstract class BaseBiz<M extends BaseMapper<T>, T> extends ServiceImpl<M, T> {

    protected final Logger _logger = LoggerFactory.getLogger(this.getClass());

    private ConfigMapper configMapper;

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

    public List<T> mineList(QueryParams query) {
        query.getQueryMap().put("crtUser", getCurrentUserId());
        return this.list(query);
    }

    /**
     * {@link Query}自定义预先处理
     *
     * @param query
     */
    protected void preProcessQuery(QueryParams query) {}

    public QueryWrapper<T> parseQuery(QueryParams query) {
        Class<T> clazz = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
        this.preProcessQuery(query);

        this.processSceneId(query);

        return WrapperUtils.parseQuery(query, clazz);
    }

    /**
     * sceneId 场景ID查询-追加到条件组中
     * @param query
     */
    protected void processSceneId(QueryParams query) {
        if (query.getSceneId() == null || query.getSceneId() == 0) return;

        if (configMapper == null) {
            configMapper = SpringUtil.getBean(ConfigMapper.class);
        }
        Config config = configMapper.selectById(query.getSceneId());
        if (config != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                TypeReference<List<ConditionGroup>> typeReference = new TypeReference<List<ConditionGroup>>() {};
                List<ConditionGroup> list = objectMapper.readValue(config.getData(), typeReference);
                query.addConditionGroupList(list);
            } catch (Exception e) {
                _logger.error("config: {}", config);
                _logger.error(e.getMessage(), e);
                throw new BuzzException("解析条件失败，请联系管理员");
            }
        }
    }

    public TableResultResponse<T> selectPageByQuery(QueryParams query) {
        QueryWrapper<T> wrapper = parseQuery(query);
        if (query.getPageSize() > 1000) throw new BuzzException("查询结果数量大于1000，请缩小查询范围");
        Page<T> page = new Page<>(query.getCurrent(), query.getPageSize());
        Page<T> result =  super.page(page, wrapper);
        return new TableResultResponse<T>(result);
    }

    public List<T> list(QueryParams query) {
        QueryWrapper<T> wrapper = parseQuery(query);
        return super.list(wrapper);
    }

    /**
     * 根据查询条件，获取下载Excel的数据List
     *
     * @param query
     * @return
     */
    public List<T> selectExportExcelList(QueryParams query) {
        QueryWrapper<T> wrapper = parseQuery(query);
        long count = super.count(wrapper);
        if (count > 10000) throw new BuzzException("查询结果数量大于10000，请缩小查询范围");
        return super.list(wrapper);
    }

    /**
     * 根据组合查询条件，下载Excel
     *
     * @param query
     * @throws IOException
     */
    public void exportExcel(QueryParams query) throws IOException {
        List<T> list = this.selectExportExcelList(query);
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

        FaModalName anno = clazz.getAnnotation(FaModalName.class);

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

    public String getCurrentUserId() {
        return BaseContextHandler.getUserId();
    }

    protected ObjectRestResponse<Boolean> ok() {
        return new ObjectRestResponse<Boolean>().rel(true);
    }

    protected ObjectRestResponse<Object> ok(Object data) {
        return new ObjectRestResponse<>().data(data);
    }

}
