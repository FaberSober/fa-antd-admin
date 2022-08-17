package com.faber.admin.biz;

import com.faber.admin.entity.GroupType;
import com.faber.admin.mapper.GroupTypeMapper;
import com.faber.common.biz.BaseBiz;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ${DESCRIPTION}
 *
 * @author wanghaobin
 * @create 2017-06-12 8:48
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class GroupTypeBiz extends BaseBiz<GroupTypeMapper, GroupType> {
}
