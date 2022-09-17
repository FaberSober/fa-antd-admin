package com.faber.common.rest;

import com.faber.common.biz.BaseTreeBiz;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.vo.TreeNode;
import com.faber.common.vo.TreePathVo;
import com.faber.common.vo.TreePosChangeVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * <h2>通用Tree形结构数据的Controller接口父类，包含基本的方法：</h2>
 * <h3>1. 一次性返回所有的节点，适用于节点总数较少的情况，如：节点查询</h3>
 * 1. allTree - 获取所有节点Tree<br/>
 * 2. allTreeFromNode - 从指定节点，返回向下获取所有节点Tree<br/>
 * <br/>
 *
 * <h3>2. 一次只返回当前层级的节点List，适用于节点总数很多的情况，如：地区查询</h3>
 * 1. treePathLine - 给定选中的value，返回value向上查找的节点路径xxx<br/>
 * 2. treeListLayer - 给定parentId，返回当前层级的节点List<br/>
 * 2. treeFindPath - 给定选中的value，返回value向上查找的节点路径xxx，并返回路径xxx的层级的Tree<br/>
 * <br/>
 *
 * <h3>3. 其他帮助方法</h3>
 * 1. changePos - 改变节点列表位置[排序、父节点]<br/>
 *
 * @param <Biz>
 * @param <Entity>
 */
@Slf4j
public abstract class BaseTreeController<Biz extends BaseTreeBiz, Entity> extends BaseController<Biz, Entity> {

    /**
     * 给定选中的value，返回value向上查找的节点路径[1, 1-1, 1-1-1]
     * @param id 选中的节点ID
     * @return
     */
    @RequestMapping(value = "/treePathLine/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<TreeNode<Entity>>> treePathLine(@PathVariable Serializable id) {
        List<Entity> list = (List<Entity>) baseBiz.treePathLine(id);
        List<TreeNode<Entity>> nodeList = baseBiz.transEntityListToNodeList(list);
        return ok(nodeList);
    }

    /**
     * 给定parentId，返回当前层级的节点List
     * @param parentId 选中的节点parentId
     * @return
     */
    @RequestMapping(value = "/treeListLayer/{parentId}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<TreeNode<Entity>>> treeListLayer(@PathVariable Serializable parentId) {
        List<Entity> list = (List<Entity>) baseBiz.treeListLayer(parentId);
        List<TreeNode<Entity>> nodeList = baseBiz.transEntityListToNodeList(list);
        return ok(nodeList);
    }

    /**
     * 给定选中的value，返回value向上查找的节点路径xxx，并返回路径xxx的层级的Tree
     * @param id 选中的节点ID
     * @return
     */
    @RequestMapping(value = "/treeFindPath/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<TreePathVo<Entity>> treeFindPath(@PathVariable Serializable id) {
        TreePathVo<Entity> data = (TreePathVo<Entity>) baseBiz.treeFindPath(id);
        return ok(data);
    }

    /**
     * 获取所有节点Tree
     * @return
     */
    @RequestMapping(value = "/allTree", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<TreeNode<Entity>>> allTree() {
        List<TreeNode<Entity>> treeList = baseBiz.allTree();
        return new ObjectRestResponse<List<TreeNode<Entity>>>().data(treeList);
    }

    /**
     * 获取所有节点Tree
     * @return
     */
    @RequestMapping(value = "/getTree", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<List<TreeNode<Entity>>> getTree(@RequestBody Map<String, Object> params) {
        List<TreeNode<Entity>> treeList = baseBiz.getTree(params);
        return new ObjectRestResponse<List<TreeNode<Entity>>>().data(treeList);
    }

    /**
     * 从指定节点，返回向下获取所有节点Tree
     * @param id 指定节点ID
     * @return
     */
    @RequestMapping(value = "/allTreeFromNode/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<TreeNode<Entity>>> allTreeFromNode(@PathVariable("id") Serializable id) {
        List<TreeNode<Entity>> treeList = baseBiz.allTreeFromNode(id);
        return new ObjectRestResponse<List<TreeNode<Entity>>>().data(treeList);
    }

    /**
     * 改变节点列表位置[排序、父节点]
     * @param list
     * @return
     */
    @RequestMapping(value = "/changePos", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse changePos(@Valid @RequestBody List<TreePosChangeVo> list) {
        baseBiz.changePos(list);
        return new ObjectRestResponse().rel(true);
    }

}
