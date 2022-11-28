package com.faber.buzz.article.biz;

import com.faber.buzz.article.entity.Detail;
import com.faber.buzz.article.mapper.DetailMapper;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

/**
 * 文章-详情
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-31 13:53:39
 */
@Service
public class DetailBiz extends BaseBiz<DetailMapper, Detail> {

    public Detail createByOutlineId(int outlineId) {
        Detail detail = new Detail();
        detail.setDetail("");
        detail.setOutlineId(outlineId);
        this.save(detail);
        return detail;
    }

}