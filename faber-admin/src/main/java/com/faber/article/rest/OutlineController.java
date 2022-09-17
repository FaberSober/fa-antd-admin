package com.faber.article.rest;

import com.faber.article.biz.OutlineBiz;
import com.faber.article.entity.Outline;
import com.faber.article.vo.OutlineDetailVo;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseTreeController;
import com.faber.common.vo.TreeNode;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/article/outline")
public class OutlineController extends BaseTreeController<OutlineBiz,Outline> {

    @RequestMapping(value = "/findDetail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<OutlineDetailVo> findDetail(@PathVariable int id) {
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
    public ObjectRestResponse<List<TreeNode<Outline>>> allTree(@PathVariable int bookId) {
        List<TreeNode<Outline>> treeList = baseBiz.allTree(bookId);
        return new ObjectRestResponse<List<TreeNode<Outline>>>().data(treeList);
    }

}
