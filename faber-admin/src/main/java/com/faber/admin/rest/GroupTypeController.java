package com.faber.admin.rest;

import com.faber.admin.biz.GroupTypeBiz;
import com.faber.admin.entity.GroupType;
import com.faber.common.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * ${DESCRIPTION}
 */
@Controller
@RequestMapping("/api/admin/groupType")
public class GroupTypeController extends BaseController<GroupTypeBiz, GroupType, Integer> {

}
