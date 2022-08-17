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
//    @Cache(key = "permission:menu")
    public List<Menu> selectListAll() {
        Example example = new Example(Menu.class);
        example.createCriteria().andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE);
        return mapper.selectByExample(example);
    }

    @Override
//    @CacheClear(pre = "permission")
    public void insertSelective(Menu entity) {
        // 插入时校验编码是否重复
        Example example = new Example(Menu.class);
        example.createCriteria().andEqualTo("code", entity.getCode()).andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE);
        int count = mapper.selectCountByExample(example);
        if (count > 0) throw new BuzzException("权限编码重复");

        super.setNextSort(entity); // 设置entity的排序

        super.insertSelective(entity);
    }

    @Override
//    @CacheClear(pre = "permission")
    public void updateSelectiveById(Menu entity) {
        if (entity.getParentId() == entity.getId().intValue()) {
            throw new BuzzException("父节点不能是自身");
        }

        // 插入时校验编码是否重复
        Example example = new Example(Menu.class);
        example.createCriteria()
                .andEqualTo("code", entity.getCode())
                .andNotEqualTo("id", entity.getId())
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE);
        int count = mapper.selectCountByExample(example);
        if (count > 0) throw new BuzzException("权限编码重复");
        super.updateSelectiveById(entity);
    }

    @Override
//    @CacheClear(pre = "permission")
    public void deleteById(Object id) {
        super.logicDeleteById(id);

        // 同步删除子菜单
        EntityUtils.ReqUserInfo reqUserInfo = EntityUtils.getReqUserInfo();
        if (reqUserInfo == null) return;

        String notAttachedMenuIds = mapper.findNotAttachedMenuIds();
        while (StringUtils.isNotEmpty(notAttachedMenuIds)) {
            mapper.removeByMenuIds(notAttachedMenuIds, reqUserInfo.getName(), reqUserInfo.getId(), reqUserInfo.getIp());
            notAttachedMenuIds = mapper.findNotAttachedMenuIds();
        }

        // 同步删除Element元素
        elementBiz.getMapper().removeNotValid(reqUserInfo.getName(), reqUserInfo.getId(), reqUserInfo.getIp());
    }

    /**
     * 获取用户可以访问的菜单
     */
//    @Cache(key = "permission:menu:u{1}")
    public List<Menu> getUserAuthorityMenuByUserId(String id) {
        return mapper.selectAuthorityMenuByUserId(id);
    }

    public List<TreeNode<Menu>> blockAllTree(int blockId) {
        Example example = new Example(getEntityClass());
        Example.Criteria criteria = example.createCriteria();
        criteria
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("blockId", blockId);
        this.enhanceTreeQuery(criteria);

        example.setOrderByClause(this.getSorterAscendSql()); // 设置排序
        List<Menu> beanList = mapper.selectByExample(example);
        List<TreeNode<Menu>> list = this.getMenuTree(beanList, CommonConstants.ROOT + "");
        return list;
    }

}
