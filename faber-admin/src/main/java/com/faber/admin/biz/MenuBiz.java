package com.faber.admin.biz;

import com.faber.admin.mapper.MenuMapper;
import com.faber.admin.entity.Menu;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.biz.BaseTreeBiz;
import com.faber.common.constant.CommonConstants;
import com.faber.common.exception.BuzzException;
import com.faber.common.util.EntityUtils;
import com.faber.common.vo.TreeNode;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.entity.Example;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.List;

/**
 * ${DESCRIPTION}
 *
 * @author wanghaobin
 * @create 2017-06-12 8:48
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class MenuBiz extends BaseTreeBiz<MenuMapper, Menu> {

    @Resource
    private ElementBiz elementBiz;

    @Override
    public boolean save(Menu entity) {
        long count = lambdaQuery().eq(Menu::getCode, entity.getCode()).count();
        if (count > 0) throw new BuzzException("权限编码重复");
        super.setNextSort(entity); // 设置entity的排序
        return super.save(entity);
    }

    @Override
    public boolean updateById(Menu entity) {
        if (entity.getParentId() == entity.getId().intValue()) {
            throw new BuzzException("父节点不能是自身");
        }

        long count = lambdaQuery()
                .eq(Menu::getCode, entity.getCode())
                .ne(Menu::getId, entity.getId())
                .count();
        if (count > 0) throw new BuzzException("权限编码重复");

        return super.updateById(entity);
    }

    @Override
    public boolean removeById(Serializable id) {
        super.removeById(id);

        // 同步删除子菜单
        EntityUtils.ReqUserInfo reqUserInfo = EntityUtils.getReqUserInfo();
        if (reqUserInfo == null) return true;

        List<Integer> notAttachedMenuIds = baseMapper.findNotAttachedMenuIds();
        while (!notAttachedMenuIds.isEmpty()) {
            removeBatchByIds(notAttachedMenuIds);
            notAttachedMenuIds = baseMapper.findNotAttachedMenuIds();
        }

        // 同步删除Element元素
        elementBiz.getBaseMapper().removeNotValid(reqUserInfo.getName(), reqUserInfo.getId(), reqUserInfo.getIp());

        return true;
    }

    /**
     * 获取用户可以访问的菜单
     */
//    @Cache(key = "permission:menu:u{1}")
    public List<Menu> getUserAuthorityMenuByUserId(String id) {
        return baseMapper.selectAuthorityMenuByUserId(id);
    }

    public List<TreeNode<Menu>> blockAllTree(int blockId) {
        List<Menu> beanList = lambdaQuery()
                .eq(Menu::getBlockId, blockId)
                .orderByAsc(Menu::getOrderNum)
                .list();
        return this.getMenuTree(beanList, CommonConstants.ROOT);
    }

}
