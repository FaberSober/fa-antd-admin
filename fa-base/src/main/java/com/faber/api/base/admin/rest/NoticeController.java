package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.NoticeBiz;
import com.faber.api.base.admin.entity.Notice;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@FaLogBiz("公告")
@RestController
@RequestMapping("/api/base/admin/notice")
public class NoticeController extends BaseController<NoticeBiz, Notice, Integer> {

}