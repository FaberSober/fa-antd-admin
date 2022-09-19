package com.faber.admin.rest;

import com.faber.admin.biz.DictTypeBiz;
import com.faber.admin.entity.DictType;
import com.faber.common.rest.BaseTreeController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/admin/dictType")
public class DictTypeController extends BaseTreeController<DictTypeBiz, DictType, Integer> {

}
