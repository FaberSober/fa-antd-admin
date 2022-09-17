package com.faber.admin.rest;

import com.faber.admin.biz.GroupBiz;
import com.faber.admin.entity.Group;
import com.faber.common.rest.BaseTreeController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * ${DESCRIPTION}
 */
@Controller
@RequestMapping("/api/admin/group")
public class GroupController extends BaseTreeController<GroupBiz, Group> {

}
