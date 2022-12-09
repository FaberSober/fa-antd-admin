package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.BizFileBiz;
import com.faber.api.base.admin.entity.BizFile;
import com.faber.core.web.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/base/admin/bizFile")
public class BizFileController extends BaseController<BizFileBiz, BizFile, Integer> {

}