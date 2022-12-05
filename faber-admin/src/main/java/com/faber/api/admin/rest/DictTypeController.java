package com.faber.api.admin.rest;

import com.faber.api.admin.biz.DictTypeBiz;
import com.faber.api.admin.entity.DictType;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/admin/dictType")
public class DictTypeController extends BaseTreeController<DictTypeBiz, DictType, Integer> {

}
