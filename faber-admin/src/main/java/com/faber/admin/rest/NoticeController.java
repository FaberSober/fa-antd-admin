package com.faber.admin.rest;

import com.faber.common.rest.BaseController;
import com.faber.admin.biz.NoticeBiz;
import com.faber.admin.entity.Notice;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/notice")
public class NoticeController extends BaseController<NoticeBiz, Notice> {

}