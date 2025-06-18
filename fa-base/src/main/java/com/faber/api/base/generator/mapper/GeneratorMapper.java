package com.faber.api.base.generator.mapper;

import com.faber.api.base.generator.vo.req.TableQueryVo;
import com.faber.api.base.generator.vo.ret.ColumnVo;
import com.faber.api.base.generator.vo.ret.TableVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Farando
 * @date 2023/3/9 11:00
 * @description
 */
public interface GeneratorMapper {

    List<TableVo> queryTable(@Param("query") TableQueryVo tableQueryVo, @Param("sorter") String sorter);

    TableVo getTableByName(@Param("tableName") String tableName);

    List<ColumnVo> queryColumns(@Param("tableName") String tableName);

}
