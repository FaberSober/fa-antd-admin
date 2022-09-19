package com.faber.admin.rest;

import com.faber.admin.biz.MenuBiz;
import com.faber.admin.entity.Menu;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseTreeController;
import com.faber.common.vo.TreeNode;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * 系统菜单
 */
@Controller
@RequestMapping("/api/admin/menu")
public class MenuController extends BaseTreeController<MenuBiz, Menu, Integer> {

    /**
     * 获取所有block下的菜单
     * @return
     */
    @RequestMapping(value = "/block/allTree/{blockId}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<TreeNode<Menu>>> blockAllTree(@PathVariable("blockId") int blockId) {
        List<TreeNode<Menu>> treeList = baseBiz.blockAllTree(blockId);
        return new ObjectRestResponse<List<TreeNode<Menu>>>().data(treeList);
    }

}
