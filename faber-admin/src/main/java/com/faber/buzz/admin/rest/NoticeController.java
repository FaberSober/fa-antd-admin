package com.faber.buzz.admin.rest;

import com.faber.buzz.admin.biz.NoticeBiz;
import com.faber.buzz.admin.entity.Notice;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/notice")
public class NoticeController extends BaseController<NoticeBiz, Notice, Integer> {

}