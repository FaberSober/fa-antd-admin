package com.faber.article.biz;

import org.springframework.stereotype.Service;

import com.faber.article.entity.Detail;
import com.faber.article.mapper.DetailMapper;
import com.faber.common.biz.BaseBiz;

/**
 * 文章-详情
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-31 13:53:39
 */
@Service
public class DetailBiz extends BaseBiz<DetailMapper,Detail> {

    public Detail createByOutlineId(int outlineId) {
        Detail detail = new Detail();
        detail.setDetail("");
        detail.setOutlineId(outlineId);
        this.insertSelective(detail);
        return detail;
    }

}