package com.faber.api.article.rest;

import com.faber.api.article.biz.DetailBiz;
import com.faber.api.article.entity.Detail;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/article/detail")
public class DetailController extends BaseController<DetailBiz, Detail, Integer> {

}