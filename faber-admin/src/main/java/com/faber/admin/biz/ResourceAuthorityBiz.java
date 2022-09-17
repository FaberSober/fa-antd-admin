package com.faber.admin.biz;

import com.faber.admin.entity.ResourceAuthority;
import com.faber.admin.mapper.ResourceAuthorityMapper;
import com.faber.common.biz.BaseBiz;
import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by Ace on 2017/6/19.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class ResourceAuthorityBiz extends BaseBiz<ResourceAuthorityMapper, ResourceAuthority> {

    public void updateGroupAuth(Map<String, Object> params) {
        Integer groupId = MapUtils.getInteger(params, "groupId");

        List<Integer> menuAddIds = (List<Integer>) params.get("menuAddIds");
        List<Integer> menuRemoveIds = (List<Integer>) params.get("menuRemoveIds");
        List<Integer> elementAddIds = (List<Integer>) params.get("elementAddIds");
        List<Integer> elementRemoveIds = (List<Integer>) params.get("elementRemoveIds");

        menuAddIds.forEach(id -> {
            ResourceAuthority auth = this.genMenuAuth(groupId, id);
            save(auth);
        });

        menuRemoveIds.forEach(id -> {
            ResourceAuthority auth = this.genMenuAuth(groupId, id);
            removeById(auth);
        });

        elementAddIds.forEach(id -> {
            ResourceAuthority auth = this.genElementAuth(groupId, id);
            save(auth);
        });

        elementRemoveIds.forEach(id -> {
            ResourceAuthority auth = this.genElementAuth(groupId, id);
            removeById(auth);
        });

        super.clearMenuAndElementCache();
    }

    public ResourceAuthority genMenuAuth(int groupId, int menuId) {
        ResourceAuthority auth = new ResourceAuthority(ResourceAuthority.AuthorityType.GROUP, ResourceAuthority.ResourceType.MENU);
        auth.setAuthorityId(groupId + "");
        auth.setResourceId(menuId + "");
        auth.setParentId("-1");
        return auth;
    }

    public ResourceAuthority genElementAuth(int groupId, int elementId) {
        ResourceAuthority auth = new ResourceAuthority(ResourceAuthority.AuthorityType.GROUP, ResourceAuthority.ResourceType.BUTTON);
        auth.setAuthorityId(groupId + "");
        auth.setResourceId(elementId + "");
        auth.setParentId("-1");
        return auth;
    }
}
