package com.faber.admin.mapper;

import com.faber.admin.entity.Dict;
import com.faber.admin.entity.DictType;
import org.apache.ibatis.annotations.Param;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

/**
 * 字典值
 */
//@Mapper
public interface DictMapper extends BaseMapper<Dict> {

    List<Dict> selectByTypeCode(@Param("dictTypeCode") String dictTypeCode);

    /**
     * 查询字典值
     * @param dictTypeCode {@link DictType#getCode()}
     * @param value
     * @return
     */
    String selectByValue(@Param("dictTypeCode") String dictTypeCode, @Param("value") String value);

    List<Dict> getByCodeAndText(@Param("dictTypeCode") String dictTypeCode, @Param("dictText") String dictText);

    List<Dict> getByCodeAndValue(@Param("dictTypeCode") String dictTypeCode, @Param("dictValue") String dictValue);

}
