package com.faber.admin.rest;

import com.faber.admin.biz.ArticleBiz;
import com.faber.admin.entity.Article;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/api/admin/article")
public class ArticleController extends BaseController<ArticleBiz, Article, Integer> {

    @RequestMapping(value = "/findOneBuzz", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Article> findOneBuzz(@RequestBody Map<String, Object> params) {
        Article entity = baseBiz.findOneBuzz(params);
        return ok(entity);
    }

}