package com.faber.admin.biz;

import cn.hutool.core.util.ObjectUtil;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.faber.admin.mapper.GroupUserMapper;
import com.faber.admin.mapper.UserMapper;
import com.faber.admin.entity.DictType;
import com.faber.admin.entity.GroupUser;
import com.faber.admin.mapper.DictMapper;
import com.faber.admin.vo.GroupUserVo;
import com.faber.common.biz.BaseBiz;
import com.faber.common.exception.BuzzException;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.util.Query;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.stereotype.Service;


import javax.annotation.Resource;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * 领导类型角色关联
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-17 10:30:34
 */
@Service
public class GroupUserBiz extends BaseBiz<GroupUserMapper, GroupUser> {

    @Resource
    private UserMapper userMapper;

    @Resource
    private DictMapper dictMapper;

    public TableResultResponse<GroupUserVo> getGroupUsers(int groupId, Map<String, Object> params) {
        params.put("groupId", groupId);
        Query query = new Query(params);
        PageHelper.startPage(query.getPage(), query.getLimit());
        List<GroupUserVo> list = userMapper.selectGroupUser(params);
        list.parallelStream().forEach(d -> {
            d.setTypeName(dictMapper.selectByValue(DictType.Code.GROUP_USER_TYPE, d.getType()));
        });
        return new TableResultResponse<>(new PageInfo<>(list));
    }

    public void addUsers(int groupId, JSONObject json) {
        JSONArray userIds = json.getJSONArray("userIds");
        for (int i = 0; i < userIds.size(); i++) {
            String userId = userIds.getString(i);

            // 删除用户缓存
            super.clearUserCache(userId);

            // 删除之前的关联
            lambdaUpdate()
                    .eq(GroupUser::getGroupId, groupId)
                    .eq(GroupUser::getUserId, userId)
                    .remove();

            // 添加新的关联
            GroupUser addBean = new GroupUser();
            addBean.setGroupId(groupId);
            addBean.setUserId(userId);
            addBean.setType(json.getString("type"));
            addBean.setDescription(json.getString("description"));
            super.save(addBean);
        }
    }

    @Override
    public boolean removeById(Serializable id) {
        GroupUser groupUser = getById(id);

        // 不能删除自身管理员账户groupId=1
        if (ObjectUtil.equal(groupUser.getGroupId(), 1) && ObjectUtil.equal(groupUser.getUserId(), getCurrentUserId())) {
            throw new BuzzException("不可删除自身管理员角色");
        }

        return super.removeById(id);
    }

    /**
     * 修改用户角色
     * @param userId 用户ID
     * @param groupIds 角色ID数组
     */
    public void changeUserGroup(String userId, List<Integer> groupIds) {
        if (userId == null) throw new BuzzException("用户ID不能为空");

        // 删除之前的用户角色关联
        lambdaUpdate().eq(GroupUser::getUserId, userId).remove();

        // 插入新的用户角色关联
        for (Integer groupId : groupIds) {
            GroupUser groupUser = new GroupUser();
            groupUser.setUserId(userId);
            groupUser.setGroupId(groupId);
            save(groupUser);
        }
    }
}
