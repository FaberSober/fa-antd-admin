package com.faber.api.base.article.rest;

import com.faber.api.base.article.biz.DetailBiz;
import com.faber.api.base.article.entity.Detail;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/base/article/detail")
public class DetailController extends BaseController<DetailBiz, Detail, Integer> {

}