package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.DictTypeBiz;
import com.faber.api.base.admin.entity.DictType;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/base/admin/dictType")
public class DictTypeController extends BaseTreeController<DictTypeBiz, DictType, Integer> {

}
