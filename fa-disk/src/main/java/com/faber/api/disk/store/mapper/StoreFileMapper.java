package com.faber.api.disk.store.mapper;

import com.faber.core.config.mybatis.base.FaBaseMapper;
import com.faber.api.disk.store.entity.StoreFile;
import com.faber.api.disk.store.vo.req.StoreFileQueryVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * STORE-文件
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-22 09:31:17
 */
public interface StoreFileMapper extends FaBaseMapper<StoreFile> {

    List<StoreFile> queryFile(@Param("query") StoreFileQueryVo query, @Param("sorter") String sorter);

    List<StoreFile> queryChildren(@Param("id") Integer id);

    void putFileTo(@Param("id") Integer id, @Param("toDirId") Integer toDirId);

    Long sumFileSizeByBucketId(@Param("bucketId") Integer bucketId);

}
