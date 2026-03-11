package com.faber.api.base.rbac.rest;

import com.faber.api.base.rbac.biz.RbacMenuBiz;
import com.faber.api.base.rbac.entity.RbacMenu;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.vo.utils.FaOption;
import com.faber.core.web.rest.BaseTreeController;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-菜单表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaLogBiz("菜单")
@RestController
@RequestMapping("/api/base/rbac/rbacMenu")
public class RbacMenuController extends BaseTreeController<RbacMenuBiz, RbacMenu, Long> {

    @FaLogOpr(value = "查询流程菜单列表", crud = LogCrudEnum.R)
    @RequestMapping(value = "/getFlowMenuList", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<FaOption<String>>> getFlowMenuList() {
        List<FaOption<String>> o = baseBiz.getFlowMenuList();
        return ok(o);
    }
}
