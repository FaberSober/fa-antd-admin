package com.faber.admin.biz;

import com.faber.admin.entity.Article;
import com.faber.admin.mapper.ArticleMapper;
import com.faber.common.biz.BaseBiz;
import com.faber.common.exception.BuzzException;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * html文章
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-17 20:15:13
 */
@Service
public class ArticleBiz extends BaseBiz<ArticleMapper, Article> {

    public Article findOneBuzz(Map<String, Object> params) {
        Integer bizId = MapUtils.getInteger(params, "bizId");
        String bizType = MapUtils.getString(params, "bizType");

        if (bizId == null || StringUtils.isAnyEmpty(bizType)) {
            throw new BuzzException("参数为空");
        }

        Article article = mapper.selectOne(new Article(bizId, bizType));
        if (article == null) {
            article = new Article();
            article.setBizId(bizId);
            article.setBizType(bizType);
            this.insertSelective(article);
        }
        return article;
    }

}