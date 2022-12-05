package com.faber.api.admin.rest;

import com.faber.api.admin.biz.BizFileBiz;
import com.faber.api.admin.entity.BizFile;
import com.faber.core.web.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/admin/bizFile")
public class BizFileController extends BaseController<BizFileBiz, BizFile, Integer> {

}