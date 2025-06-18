package com.faber.api.app.app.mapper;

import com.faber.core.config.mybatis.base.FaBaseMapper;
import com.faber.api.app.app.entity.Apk;
import org.apache.ibatis.annotations.Param;

/**
 * APP-APK表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-18 20:31:39
 */
public interface ApkMapper extends FaBaseMapper<Apk> {

    void sumDownloadNum(@Param("id") Integer id);
	
}
