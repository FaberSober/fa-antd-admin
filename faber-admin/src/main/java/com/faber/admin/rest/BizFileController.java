package com.faber.admin.rest;

import com.faber.admin.biz.BizFileBiz;
import com.faber.admin.entity.BizFile;
import com.faber.common.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/admin/bizFile")
public class BizFileController extends BaseController<BizFileBiz, BizFile, Integer> {

}