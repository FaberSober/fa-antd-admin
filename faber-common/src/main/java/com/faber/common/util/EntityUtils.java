package com.faber.common.util;

import cn.hutool.core.util.ReflectUtil;
import com.faber.common.context.BaseContextHandler;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.util.Date;

/**
 * 实体类相关工具类
 * 解决问题： 1、快速对实体的常驻字段，如：crtUser、crtHost、updUser等值快速注入
 *
 * @author Ace
 * @version 1.0
 * @date 2016年4月18日
 * @since 1.7
 */
public class EntityUtils {

    @Data
    public static final class ReqUserInfo {
        public String ip;
        public String name;
        public String id;
    }

    public static ReqUserInfo getReqUserInfo() {
        if (RequestContextHolder.getRequestAttributes() == null) return null;
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String hostIp = "";
        String name = "";
        String id = "";
        if (request != null) {
            hostIp = StringUtils.defaultIfBlank(request.getHeader("userHost"), ClientUtil.getClientIp(request));
            name = StringUtils.trimToEmpty(request.getHeader("userName"));
            name = URLDecoder.decode(name);
            id = StringUtils.trimToEmpty(request.getHeader("userId"));
        }

        if (StringUtils.isBlank(name)) {
            name = BaseContextHandler.getUsername();
        }
        if (StringUtils.isBlank(id)) {
            id = BaseContextHandler.getUserID();
        }

        ReqUserInfo reqUserInfo = new ReqUserInfo();
        reqUserInfo.setIp(hostIp);
        reqUserInfo.setName(name);
        reqUserInfo.setId(id);
        return reqUserInfo;
    }

    /**
     * 快速将bean的crtUser、crtHost、crtTime、updUser、updHost、updTime附上相关值
     *
     * @param entity 实体bean
     * @author 王浩彬
     */
    public static <T> void setCreateAndUpdateInfo(T entity) {
        setCreateInfo(entity);
        setUpdatedInfo(entity);
    }

    /**
     * 快速将bean的crtUser、crtHost、crtTime附上相关值
     *
     * @param entity 实体bean
     * @author 王浩彬
     */
    public static <T> void setCreateInfo(T entity) {
        if (!ReflectUtil.hasField(entity.getClass(), "crtTime")) {
            return;
        }
        ReqUserInfo reqUserInfo = EntityUtils.getReqUserInfo();
        if (reqUserInfo == null) return;

        // 默认属性
        String[] fields = {"crtName", "crtUser", "crtHost", "crtTime", "delState"};
        Field field = ReflectionUtils.getAccessibleField(entity, "crtTime");
        // 默认值
        Object[] value = null;
        if (field != null && field.getType().equals(Date.class)) {
            value = new Object[]{reqUserInfo.getName(), reqUserInfo.getId(), reqUserInfo.getIp(), new Date(), BaseDelEntity.DEL_STATE.AVAILABLE};
        }
        // 填充默认属性值
        setDefaultValues(entity, fields, value);
    }

    /**
     * 快速将bean的updUser、updHost、updTime附上相关值
     *
     * @param entity 实体bean
     * @author 王浩彬
     */
    public static <T> void setUpdatedInfo(T entity) {
        if (!ReflectUtil.hasField(entity.getClass(), "updTime")) {
            return;
        }

        ReqUserInfo reqUserInfo = EntityUtils.getReqUserInfo();
        if (reqUserInfo == null) return;

        // 默认属性
        String[] fields = {"updName", "updUser", "updHost", "updTime"};
        Field field = ReflectionUtils.getAccessibleField(entity, "updTime");
        Object[] value = null;
        if (field != null && field.getType().equals(Date.class)) {
            value = new Object[]{reqUserInfo.getName(), reqUserInfo.getId(), reqUserInfo.getIp(), new Date()};
        }
        // 填充默认属性值
        setDefaultValues(entity, fields, value);
    }

    /**
     * 快速将bean的updUser、updHost、updTime附上相关值
     *
     * @param entity 实体bean
     * @author 王浩彬
     */
    public static <T> void setLogicDeleteInfo(T entity) {
        if (!ReflectUtil.hasField(entity.getClass(), "delTime")) {
            return;
        }

        ReqUserInfo reqUserInfo = EntityUtils.getReqUserInfo();
        if (reqUserInfo == null) return;

        // 默认属性
        String[] fields = {"delName", "delUser", "delHost", "delTime", "delState"};
        Field field = ReflectionUtils.getAccessibleField(entity, "delTime");
        Object[] value = null;
        if (field != null && field.getType().equals(Date.class)) {
            value = new Object[]{reqUserInfo.getName(), reqUserInfo.getId(), reqUserInfo.getIp(), new Date(), BaseDelEntity.DEL_STATE.DELETED};
        }
        // 填充默认属性值
        setDefaultValues(entity, fields, value);
    }

    /**
     * 依据对象的属性数组和值数组对对象的属性进行赋值
     *
     * @param entity 对象
     * @param fields 属性数组
     * @param value  值数组
     * @author 王浩彬
     */
    private static <T> void setDefaultValues(T entity, String[] fields, Object[] value) {
        for (int i = 0; i < fields.length; i++) {
            String field = fields[i];
            if (ReflectionUtils.hasField(entity, field)) {
                ReflectionUtils.invokeSetter(entity, field, value[i]);
            }
        }
    }

    /**
     * 根据主键属性，判断主键是否值为空
     *
     * @param entity
     * @param field
     * @return 主键为空，则返回false；主键有值，返回true
     * @author 王浩彬
     * @date 2016年4月28日
     */
    public static <T> boolean isPKNotNull(T entity, String field) {
        if (!ReflectionUtils.hasField(entity, field)) {
            return false;
        }
        Object value = ReflectionUtils.getFieldValue(entity, field);
        return value != null && !"".equals(value);
    }
}
