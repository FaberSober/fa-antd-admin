package com.faber.api.admin.rest;

import com.faber.core.web.rest.BaseController;
import com.faber.api.admin.biz.EntityLogBiz;
import com.faber.api.admin.entity.EntityLog;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE- 实体变更日志
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-10-13 14:54:09
 */
@RestController
@RequestMapping("/api/admin/entityLog")
public class EntityLogController extends BaseController<EntityLogBiz, EntityLog, Integer> {

}