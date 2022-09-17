package com.faber.admin.biz;

import com.faber.admin.mapper.ElementMapper;
import com.faber.admin.entity.Element;
import com.faber.admin.entity.Menu;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.biz.BaseBiz;
import com.faber.common.exception.BuzzException;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.util.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.entity.Example;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ${DESCRIPTION}
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class ElementBiz extends BaseBiz<ElementMapper, Element> {

    @Resource
    private MenuBiz menuBiz;

//    @Cache(key = "permission:ele:u{1}")
    public List<Element> getAuthorityElementByUserId(String userId) {
        return baseMapper.selectAuthorityElementByUserId(userId);
    }

//    @Cache(key = "permission:ele")
    public List<Element> getAllElementPermissions() {
        return baseMapper.selectAllElementPermissions();
    }

    @Override
    public boolean save(Element entity) {
        // 插入时校验编码是否重复
        long count = lambdaQuery().eq(Element::getCode, entity.getCode()).count();
        if (count > 0) throw new BuzzException("权限编码重复");
        return super.save(entity);
    }

    @Override
    public boolean updateById(Element entity) {
        // 插入时校验编码是否重复
        long count = lambdaQuery()
                .eq(Element::getCode, entity.getCode())
                .eq(Element::getId, entity.getId())
                .count();
        if (count > 0) throw new BuzzException("权限编码重复");
        return super.updateById(entity);
    }

    @Override
    protected void preProcessQuery(Query query) {
        // 菜单分组级联查询
        if (query.containsKey("casMenuId")) {
            Integer type  = Integer.parseInt(query.get("casMenuId").toString());

            List<Menu> menuList = menuBiz.findAllChildren(type);
            List<Integer> menuIdList = menuList.stream().map(Menu::getId).collect(Collectors.toList());
            query.put("menuId#$in", menuIdList);

            query.remove("casMenuId");
        }
    }

    @Override
    public TableResultResponse<Element> selectPageByQuery(Query query) {
        TableResultResponse<Element> tableResultResponse = super.selectPageByQuery(query);
        tableResultResponse.getData().getRows().forEach(element -> {
            element.setMenu(menuBiz.getById(element.getMenuId()));
        });
        return tableResultResponse;
    }

//    public List<Element> getAuthorityElementByUserId(String userId, String menuId) {
//        return mapper.selectAuthorityMenuElementByUserId(userId, menuId);
//    }

//    public List<Element> selectByMenuCode(String menuCode) {
//        String userId = BaseContextHandler.getUserID();
//        return mapper.selectByMenuCode(menuCode, userId);
//    }
}
