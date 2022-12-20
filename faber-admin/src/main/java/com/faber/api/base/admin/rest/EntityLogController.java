package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.entity.EntityLog;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.base.admin.biz.EntityLogBiz;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE- 实体变更日志
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-10-13 14:54:09
 */
@FaLogBiz("变更日志")
@RestController
@RequestMapping("/api/base/admin/entityLog")
public class EntityLogController extends BaseController<EntityLogBiz, EntityLog, Integer> {

}