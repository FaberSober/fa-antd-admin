package com.faber.buzz.admin.rest;

import com.faber.buzz.admin.biz.DictTypeBiz;
import com.faber.buzz.admin.entity.DictType;
import com.faber.common.web.rest.BaseTreeController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/admin/dictType")
public class DictTypeController extends BaseTreeController<DictTypeBiz, DictType, Integer> {

}
