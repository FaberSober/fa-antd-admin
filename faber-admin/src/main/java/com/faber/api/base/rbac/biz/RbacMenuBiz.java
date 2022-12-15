package com.faber.api.base.rbac.biz;

import cn.hutool.core.util.ObjectUtil;
import com.alicp.jetcache.anno.Cached;
import com.faber.api.base.rbac.mapper.RbacMenuMapper;
import com.faber.api.base.rbac.entity.RbacMenu;
import com.faber.core.config.redis.annotation.FaCacheClear;
import com.faber.core.exception.BuzzException;
import com.faber.core.vo.tree.TreeNode;
import com.faber.core.vo.tree.TreePosChangeVo;
import com.faber.core.web.biz.BaseTreeBiz;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

/**
 * BASE-权限表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacMenuBiz extends BaseTreeBiz<RbacMenuMapper, RbacMenu> {

    @Cached(name="rbac:allMenuTree", key="new String('')", expire = 3600)
    @Override
    public List<TreeNode<RbacMenu>> allTree() {
        return super.allTree();
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean save(RbacMenu entity) {
        long count = lambdaQuery().eq(RbacMenu::getLinkUrl, entity.getLinkUrl()).count();
        if (count > 0) throw new BuzzException("链接已存在，不可重复录入");

        return super.save(entity);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean updateById(RbacMenu entity) {
        if (ObjectUtil.equal(entity.getParentId(), entity.getId())) {
            throw new BuzzException("父节点不能是自身");
        }

        // 不能选择本节点的子节点
        List<RbacMenu> subMenus = this.getAllChildrenFromNode(entity.getId());
        Optional<RbacMenu> optional = subMenus.stream().filter(i -> ObjectUtil.equal(i.getId(), entity.getParentId())).findFirst();
        if (optional.isPresent()) {
            throw new BuzzException("父节点不能选择本节点的子节点");
        }

        long count = lambdaQuery().eq(RbacMenu::getLinkUrl, entity.getLinkUrl()).ne(RbacMenu::getId, entity.getId()).count();
        if (count > 0) throw new BuzzException("链接已存在，不可重复录入");

        return super.updateById(entity);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public void moveUp(Serializable id) {
        super.moveUp(id);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public void moveDown(Serializable id) {
        super.moveDown(id);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public void changePos(List<TreePosChangeVo> list) {
        super.changePos(list);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean removeById(Serializable id) {
        return super.removeById(id);
    }
}