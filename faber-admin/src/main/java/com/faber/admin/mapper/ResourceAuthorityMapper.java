package com.faber.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.faber.admin.entity.ResourceAuthority;
import org.apache.ibatis.annotations.Param;

public interface ResourceAuthorityMapper extends BaseMapper<ResourceAuthority> {

    void deleteByAuthorityIdAndResourceType(@Param("authorityId") String authorityId, @Param("resourceType") String resourceType);

}