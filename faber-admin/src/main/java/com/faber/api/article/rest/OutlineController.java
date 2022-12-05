package com.faber.api.article.rest;

import com.faber.api.article.biz.OutlineBiz;
import com.faber.api.article.entity.Outline;
import com.faber.api.article.vo.OutlineDetailVo;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseTreeController;
import com.faber.core.vo.tree.TreeNode;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/article/outline")
public class OutlineController extends BaseTreeController<OutlineBiz, Outline, Integer> {

    @RequestMapping(value = "/findDetail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<OutlineDetailVo> findDetail(@PathVariable int id) {
        OutlineDetailVo o = baseBiz.findDetail(id);
        return ok(o);
    }

    /**
     * 获取所有Item列表Tree
     * @param bookId
     * @return
     */
    @RequestMapping(value = "/{bookId}/allTree", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<TreeNode<Outline>>> allTree(@PathVariable int bookId) {
        List<TreeNode<Outline>> treeList = baseBiz.allTree(bookId);
        return new Ret<List<TreeNode<Outline>>>().data(treeList);
    }

}
