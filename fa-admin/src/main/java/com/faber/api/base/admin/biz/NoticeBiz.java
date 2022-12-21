package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.Notice;
import com.faber.api.base.admin.mapper.NoticeMapper;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

/**
 * BASE-通知与公告
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2021-01-07 09:37:36
 */
@Service
public class NoticeBiz extends BaseBiz<NoticeMapper, Notice> {

}