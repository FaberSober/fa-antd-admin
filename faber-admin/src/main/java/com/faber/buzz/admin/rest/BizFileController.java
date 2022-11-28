package com.faber.buzz.admin.rest;

import com.faber.buzz.admin.biz.BizFileBiz;
import com.faber.buzz.admin.entity.BizFile;
import com.faber.common.web.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/admin/bizFile")
public class BizFileController extends BaseController<BizFileBiz, BizFile, Integer> {

}