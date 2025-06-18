package com.faber.api.base.admin.biz;

import org.springframework.stereotype.Service;

import com.faber.api.base.admin.entity.SysNews;
import com.faber.api.base.admin.mapper.SysNewsMapper;
import com.faber.core.web.biz.BaseBiz;

/**
 * BASE-系统-新闻
 *
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2023-12-18 10:17:27
 */
@Service
public class SysNewsBiz extends BaseBiz<SysNewsMapper,SysNews> {
}