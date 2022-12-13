package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.Config;
import com.faber.api.base.admin.mapper.ConfigMapper;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;


@Service
public class ConfigBiz extends BaseBiz<ConfigMapper, Config> {

}