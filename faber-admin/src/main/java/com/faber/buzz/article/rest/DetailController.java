package com.faber.buzz.article.rest;

import com.faber.buzz.article.biz.DetailBiz;
import com.faber.buzz.article.entity.Detail;
import com.faber.common.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/article/detail")
public class DetailController extends BaseController<DetailBiz, Detail, Integer> {

}