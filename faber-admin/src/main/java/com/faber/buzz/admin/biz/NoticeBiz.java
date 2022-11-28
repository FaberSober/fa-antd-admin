package com.faber.buzz.admin.biz;

import com.faber.buzz.admin.entity.Notice;
import com.faber.buzz.admin.mapper.NoticeMapper;
import com.faber.common.web.biz.BaseBiz;
import com.faber.buzz.admin.enums.DictTypeCodeEnum;
import com.faber.common.vo.msg.TableRet;
import com.faber.common.vo.query.QueryParams;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * BASE-通知与公告
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2021-01-07 09:37:36
 */
@Service
public class NoticeBiz extends BaseBiz<NoticeMapper, Notice> {

    @Resource
    private DictBiz dictBiz;

    @Override
    public TableRet<Notice> selectPageByQuery(QueryParams query) {
        TableRet<Notice> table = super.selectPageByQuery(query);

        // 字典值
        table.getData()
                .addDict("status", dictBiz.getByCode(DictTypeCodeEnum.BASE_DICT_BOOL))
                .addDict("strongNotice", dictBiz.getByCode(DictTypeCodeEnum.BASE_DICT_BOOL));

        return table;
    }
}