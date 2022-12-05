package com.faber.api.admin.rest;

import com.faber.api.admin.biz.NoticeBiz;
import com.faber.api.admin.entity.Notice;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/notice")
public class NoticeController extends BaseController<NoticeBiz, Notice, Integer> {

}