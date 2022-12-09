package com.faber.api.base.admin.biz;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.ReflectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.faber.api.base.admin.entity.EntityLog;
import com.faber.api.base.admin.mapper.EntityLogMapper;
import com.faber.api.base.admin.enums.EntityLogActionEnum;
import com.faber.core.annotation.FaCol;
import com.faber.core.bean.BaseCrtEntity;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.bean.BaseUpdEntity;
import com.faber.core.web.biz.BaseBiz;
import com.faber.core.exception.BuzzException;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.function.BiFunction;

/**
 * BASE- 实体变更日志
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-10-13 14:54:09
 */
@Service
public class EntityLogBiz extends BaseBiz<EntityLogMapper, EntityLog> {

    private static List<Class<?>> IGNORE_CLASS_LIST = Arrays.asList(BaseDelEntity.class, BaseUpdEntity.class, BaseCrtEntity.class);

    public <T> String getId(T item) {
        // 获取ID
        Field[] fields = ReflectUtil.getFields(item.getClass(), field -> field.getAnnotation(TableId.class) != null);
        if (fields == null || fields.length != 1) throw new BuzzException("TableId的注解数量不为1，请确认");

        return StrUtil.toString(ReflectUtil.getFieldValue(item, fields[0]));
    }

    public String getFieldName(Field field) {
        ExcelProperty excelProperty = field.getAnnotation(ExcelProperty.class);
        if (excelProperty != null) return ArrayUtil.join(excelProperty.value(), "/");

        FaCol faCol = field.getAnnotation(FaCol.class);
        if (faCol != null) return faCol.value();

        return field.getName();
    }

    public boolean getFieldRichHtml(Field field) {
        FaCol faCol = field.getAnnotation(FaCol.class);
        if (faCol != null) return faCol.richHtml();
        return false;
    }

    public <T> EntityLog saveAddLog(T item) {
        String id = this.getId(item);

        EntityLog log = new EntityLog();
        log.setBizType(item.getClass().getTypeName());
        log.setBizId(id);
        log.setAction(EntityLogActionEnum.ADD);
        super.save(log);
        return log;
    }

    /**
     * 保存更新日志
     *
     * @param before
     * @param after
     * @param <T>
     */
    public <T> EntityLog saveUpdateLog(T before, T after, BiFunction<Field, Object, String> transValue) {
        if (before.getClass() != after.getClass()) throw new BuzzException("两个实体Class类型不一致");

        String id = this.getId(after);

        // 计算属性变更
        Field[] fields = ReflectUtil.getFields(after.getClass(), field -> {
            if (IGNORE_CLASS_LIST.contains(field.getDeclaringClass())) return false;
            TableField tableField = field.getAnnotation(TableField.class);
            if (tableField != null && !tableField.exist()) return false;
            return true;
        });

        JSONArray array = new JSONArray();
        for (Field field : fields) {
            Object oldValue = ReflectUtil.getFieldValue(before, field);
            Object newValue = ReflectUtil.getFieldValue(after, field);
            if (ObjectUtil.equal(oldValue, newValue)) continue;

            JSONObject json = new JSONObject();
            json.set("field", field.getName());
            json.set("name", getFieldName(field));
            json.set("old", transValue.apply(field, oldValue));
            json.set("new", transValue.apply(field, newValue));
            json.set("rich", getFieldRichHtml(field));

            array.add(json);
        }
        if (array.size() == 0) return null;

        EntityLog log = new EntityLog();
        log.setBizType(after.getClass().getTypeName());
        log.setBizId(id);
        log.setAction(EntityLogActionEnum.UPDATE);
        log.setContent(array.toString());
        super.save(log);
        return log;
    }

    public <T> EntityLog saveDelLog(T item) {
        String id = this.getId(item);

        EntityLog log = new EntityLog();
        log.setBizType(item.getClass().getTypeName());
        log.setBizId(id);
        log.setAction(EntityLogActionEnum.DEL);
        super.save(log);
        return log;
    }

}