package com.faber.article.rest;

import com.faber.article.biz.DetailBiz;
import com.faber.article.entity.Detail;
import com.faber.common.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/article/detail")
public class DetailController extends BaseController<DetailBiz,Detail> {

}