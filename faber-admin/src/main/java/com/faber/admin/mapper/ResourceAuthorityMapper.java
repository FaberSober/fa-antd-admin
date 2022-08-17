package com.faber.admin.mapper;

import com.faber.admin.entity.ResourceAuthority;
import org.apache.ibatis.annotations.Param;
import tk.mybatis.mapper.common.Mapper;

public interface ResourceAuthorityMapper extends Mapper<ResourceAuthority> {

    void deleteByAuthorityIdAndResourceType(@Param("authorityId") String authorityId, @Param("resourceType") String resourceType);

}