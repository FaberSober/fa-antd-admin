package com.faber.admin.biz;

import com.faber.admin.entity.Notice;
import com.faber.admin.mapper.NoticeMapper;
import com.faber.common.biz.BaseBiz;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.vo.Query;
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
    public TableResultResponse<Notice> selectPageByQuery(Query query) {
        TableResultResponse<Notice> table = super.selectPageByQuery(query);

        // 字典值
        table.getData()
                .addDict("status", dictBiz.getByCode("common.enum.true_or_false"))
                .addDict("strongNotice", dictBiz.getByCode("common.enum.true_or_false"));

        return table;
    }
}