package com.faber.core.web.biz;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.ReflectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.faber.core.annotation.SqlSorter;
import com.faber.core.annotation.SqlTreeId;
import com.faber.core.annotation.SqlTreeName;
import com.faber.core.annotation.SqlTreeParentId;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import com.faber.core.constant.CommonConstants;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.exception.BuzzException;
import com.faber.core.utils.TreeUtil;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.vo.tree.TreeNode;
import com.faber.core.vo.tree.TreePathVo;
import com.faber.core.vo.tree.TreePosChangeVo;

import java.io.Serializable;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <h3>Tree形结构数据的Service业务方法</h3>
 *
 * @param <M>
 * @param <T>
 */
public abstract class BaseTreeBiz<M extends FaBaseMapper<T>, T> extends BaseBiz<M, T> {

    /**
     * 增强Tree数据查询，有的表可能会有一些自定义字段限制Tree结构的获取，子类可以覆盖重写此方法，来增加自定义字段的查询条件。
     */
    protected void enhanceTreeQuery(QueryWrapper<T> wrapper) {}

    /**
     * 增强Tree数据查询，有的表可能会有一些自定义字段限制Tree结构的获取，子类可以覆盖重写此方法，来增加自定义字段的查询条件。
     * 为了查询maxSort，某些entity可能需要做额外的查询条件限定
     */
    protected void enhanceTreeQueryForMaxSort(QueryWrapper<T> wrapper, T entity) {}

    @Override
    public boolean save(T entity) {
        if (getEntityParentId(entity) == null) {
            setEntityParentId(entity);
        }
        this.setNextSort(entity); // 设置entity的排序
        return super.save(entity);
    }

    @Override
    public boolean removeById(Serializable id) {
        // 删除节点，同步删除该节点向下所有的字节点
        List<T> list = this.getAllChildrenFromNode(id);
        return super.removeByIds(list.stream().map(i -> this.getEntityId(i)).collect(Collectors.toList()));
    }

    /**
     * 给定选中的value，返回value向上查找的节点路径[1, 1-1, 1-1-1]
     *
     * @param id
     * @return
     */
    public List<T> treePathLine(Serializable id) {
        if (id == null) {
            return new ArrayList<>();
        }
        T entity = getById(id);
        if (entity == null) {
            return new ArrayList<>();
        }

        List<T> list = new ArrayList<>();

        // 递归判断是否到达父节点，这里可以自定义
        if (!this.treeReachRootNode(entity)) {
            Serializable parentId = this.getEntityParentId(entity);
            list.addAll(treePathLine(parentId));
        }

        list.add(entity);
        return list;
    }

    public List<T> treePathLineWithCache(Serializable id) {
        Map<Serializable, List<T>> cache = BaseContextHandler.getCacheMap(getEntityClass().getName() + ".treePathLineWithCache");
        if (cache.containsKey(id)) {
            return cache.get(id);
        }
        List<T> data = this.treePathLine(id);
        cache.put(id, data);
        return data;
    }

    /**
     * 返回根节点，默认parentId=-1{@link CommonConstants#ROOT}为根节点
     *
     * @param parentId
     * @return
     */
    public List<T> treeListLayer(Serializable parentId) {
        // 判断根节点
        if (parentId == null || ObjectUtil.equal(getRootId(), parentId.toString())) {
            return this.treeListLayerRoot(parentId);
        }
        // 其他节点
        return this.treeListLayerNormal(parentId);
    }

    /**
     * 返回parentId下还子节点数量
     *
     * @param parentId
     * @return
     */
    public long treeCountLayer(Serializable parentId) {
        if (parentId == null) {
            return 0;
        }
        // 判断根节点
        if (ObjectUtil.equal(getRootId(), parentId.toString())) {
            return this.treeCountLayerRoot(parentId);
        }
        // 其他节点
        return this.treeCountLayerNormal(parentId);
    }

    public TreePathVo<T> treeFindPath(Serializable id) {
        List<T> list = this.treePathLine(id);
        List<TreeNode<T>> tree = this.treeGetChildren(list, 0);

        TreePathVo<T> tTreePathVo = new TreePathVo<>();

        List<TreeNode<T>> nodeList = this.transEntityListToNodeList(list);
        tTreePathVo.setList(nodeList);

        tTreePathVo.setTree(tree);
        return tTreePathVo;
    }

    private List<TreeNode<T>> treeGetChildren(List<T> list, int nodeIndex) {
        if (nodeIndex >= list.size()) {
            return null;
        }

        // 当前选中的节点
        T bean = list.get(nodeIndex);

        // 获取选中的节点的兄弟节点
        List<T> childList = this.treeListLayer(this.getEntityParentId(bean));

        List<TreeNode<T>> nodeList = new ArrayList<>();
        childList.forEach(c -> {
            List<TreeNode<T>> children = null;
            // 递归获取选中节点的子节点
            if (ObjectUtil.equal(this.getEntityId(c), this.getEntityId(bean))) {
                children = this.treeGetChildren(list, nodeIndex + 1);
            }
            TreeNode<T> treeNode = this.transEntityToTreeNode(c);
            treeNode.setChildren(children);

            nodeList.add(treeNode);
        });

        return nodeList;
    }

    /**
     * 返回根节点List，可以子类覆盖重写
     *
     * @param parentId
     * @return
     */
    public List<T> treeListLayerRoot(Serializable parentId) {
        return this.treeListLayerNormal(parentId);
    }

    public long treeCountLayerRoot(Serializable parentId) {
        return this.treeCountLayerNormal(parentId);
    }

    public QueryWrapper<T> treeLayerNormalWrapper(Serializable parentId) {
        QueryWrapper<T> wrapper = new QueryWrapper<>();
        wrapper.eq(this.getTreeParentIdFieldColumnName(), parentId);
        this.enhanceTreeQuery(wrapper);
        wrapper.orderByAsc(this.getSortedFieldColumnName());
        return wrapper;
    }

    public List<T> treeListLayerNormal(Serializable parentId) {
        QueryWrapper<T> wrapper = this.treeLayerNormalWrapper(parentId);
        return super.list(wrapper);
    }

    public long treeCountLayerNormal(Serializable parentId) {
        QueryWrapper<T> wrapper = this.treeLayerNormalWrapper(parentId);
        return super.count(wrapper);
    }

    public List<TreeNode<T>> allTree() {
        QueryWrapper<T> wrapper = new QueryWrapper<>();
        this.enhanceTreeQuery(wrapper);
        wrapper.orderByAsc(this.getSortedFieldColumnName());
        List<T> beanList = super.list(wrapper);
        return this.listToTree(beanList, getRootId());
    }

    /**
     * 所有树到指定层级。TODO：修改为
     *
     * @param level 水平
     * @return {@link List}<{@link TreeNode}<{@link T}>>
     */
    public List<TreeNode<T>> allTreeToLevel(int level) {
        List<TreeNode<T>> allTree = this.allTree();
        dropLevel(allTree, level);
        return allTree;
    }
    
    private void dropLevel(List<TreeNode<T>> tree, int level) {
        if (tree == null || tree.isEmpty()) {
            return;
        }
        for (TreeNode<T> node : tree) {
            if (node.getLevel() < level) {
                dropLevel(node.getChildren(), level);
            }
            if (node.getLevel() == level && node.getChildren() != null) {
                node.setHasChildren(false);
                node.setChildren(null);
            }
        }
    }

    public List<TreeNode<T>> getTree(QueryParams query) {
        QueryWrapper<T> wrapper = parseQuery(query);
        this.enhanceTreeQuery(wrapper);
        wrapper.orderByAsc(this.getSortedFieldColumnName());
        List<T> beanList = super.list(wrapper);
        return this.listToTree(beanList, getRootId());
    }

    /**
     * 从指定节点，返回向下获取所有节点Tree
     * @param id 指定节点ID
     * @return
     */
    public List<TreeNode<T>> allTreeFromNode(Serializable id) {
        List<T> beanList = getAllChildrenFromNode(id);
        List<TreeNode<T>> list = this.listToTree(beanList, id);
        return list;
    }

    /**
     * 从指定节点，返回向下获取所有节点List
     * @param id 指定节点ID
     * @return
     */
    public List<T> getAllChildrenFromNode(Serializable id) {
        // 递归查询所有的子节点
        List<T> beanList = this.loopFindChildren(Collections.singletonList(id));
        // 讲查询的顶级结点加入到第一个位置
        beanList.add(0, super.getById(id));
        return beanList;
    }

    /**
     * 递归查找子节点，返回向下所有子节点数组
     * @param parentIds 父节点ID数组
     * @return
     */
    public List<T> loopFindChildren(List<Serializable> parentIds) {
        QueryWrapper<T> wrapper = new QueryWrapper<>();
        wrapper.in(getTreeParentIdFieldColumnName(), parentIds);
        this.enhanceTreeQuery(wrapper);
        List<T> beanList = super.list(wrapper);

        // 获取当前层级ID集合，作为下级查询的父节点ID集合
        List<Serializable> cParentIds = new ArrayList<>();
        if (beanList != null && !beanList.isEmpty()) {
            for (T o : beanList) {
                cParentIds.add(getEntityId(o));
            }
        }
        if (!cParentIds.isEmpty()) {
            beanList.addAll(this.loopFindChildren(cParentIds));
        }

        return beanList;
    }

    public void changePos(List<TreePosChangeVo> list) {
        if (list == null || list.isEmpty()) {
            return;
        }

        list.forEach(item -> {
            T bean = super.getById(item.getKey());

            ReflectUtil.setFieldValue(bean, this.getSortedFieldName(), item.getIndex());
            ReflectUtil.setFieldValue(bean, this.getTreeParentIdFieldName(), item.getPid());

            super.updateById(bean);
        });
    }

    public void moveUp(Serializable id) {
        T entity = getById(id);
        List<T> list = this.treeListLayerNormal(getEntityParentId(entity));
        List<Serializable> idList = list.stream().map(i -> getEntityId(i)).collect(Collectors.toList());
        int oldIndex = idList.indexOf(id);
        if (oldIndex == 0) {
            return; // 无需移动
        }

        list.add(oldIndex - 1, list.remove(oldIndex));
        for (int i = 0; i < list.size(); i++) {
            T item = list.get(i);
            int sort = getEntitySortId(item);
            if (sort != i) {
                setSort(item, i);
                this.updateById(item);
            }
        }
    }

    public void moveDown(Serializable id) {
        T entity = getById(id);
        List<T> list = this.treeListLayerNormal(getEntityParentId(entity));
        List<Serializable> idList = list.stream().map(i -> getEntityId(i)).collect(Collectors.toList());
        int oldIndex = idList.indexOf(id);
        if (oldIndex == list.size() - 1) {
            return; // 无需移动
        }

        list.add(oldIndex + 1, list.remove(oldIndex));
        for (int i = 0; i < list.size(); i++) {
            T item = list.get(i);
            int sort = getEntitySortId(item);
            if (sort != i) {
                setSort(item, i);
                this.updateById(item);
            }
        }
    }

    /**
     * 将list转换为tree形结构数据
     * @param beanList
     * @param root
     * @return
     */
    public List<TreeNode<T>> listToTree(List<T> beanList, Serializable root) {
        List<TreeNode<T>> trees = new ArrayList<>();
        TreeNode<T> treeNode = null;
        for (T entity : beanList) {
            treeNode = new TreeNode<T>();
            treeNode.setId(this.getEntityId(entity));
            treeNode.setParentId(this.getEntityParentId(entity));
            treeNode.setName(ObjectUtil.toString(this.getEntityName(entity)));
            treeNode.setSort(this.getEntitySortId(entity));
            treeNode.setLevel(1);
            // 判断节点是否还有子节点
            treeNode.setHasChildren(this.countChildren(beanList, this.getEntityId(entity)) > 0);
            treeNode.setSourceData(entity);
            trees.add(treeNode);
        }
        return TreeUtil.build(trees, root);
    }

    protected long countChildren(List<T> beanList, Serializable id) {
        return beanList.stream().filter(i -> ObjectUtil.equal(getEntityParentId(i), id)).count();
    }

    /**
     * 获取默认的顶级根节点ID
     * @return
     */
    public Serializable getRootId() {
        return CommonConstants.ROOT + "";
    }


    /**
     * 判断是否到达根节点
     *
     * @param entity
     * @return
     */
    protected boolean treeReachRootNode(T entity) {
        return ObjectUtil.equal(ObjectUtil.toString(getEntityParentId(entity)), getRootId());
    }

    /**
     * 设置entity的排序，为当前所属层级最大的sort+1
     * @param entity
     */
    protected void setNextSort(T entity) {
        Field field = getAnnotationField(SqlSorter.class);
        if (field == null) {
            String msg = String.format("%1$s类未设置@SqlSorter注解，未能查找到排序字段，请确认代码。", getEntityClass().getName());
            throw new BuzzException(msg);
        }
        SqlSorter anno = field.getAnnotation(SqlSorter.class);
        if (!anno.autoSort()) {
            return;
        }
        ReflectUtil.setFieldValue(entity, getSortedFieldName(), getMaxSort(getEntityParentId(entity), entity) + 1);
    }

    /**
     * 设置entity的排序，为当前所属层级最大的sort+1
     * @param entity
     */
    protected void setSort(T entity, int sort) {
        ReflectUtil.setFieldValue(entity, getSortedFieldName(), sort);
    }

    /**
     * 获取最大的排序
     * @param parentId 父节点ID
     * @param entity 实体
     * @return
     */
    protected Integer getMaxSort(Object parentId, T entity) {
        QueryWrapper<T> wrapper = new QueryWrapper<>();
        wrapper.eq(getTreeParentIdFieldColumnName(), parentId);
        this.enhanceTreeQueryForMaxSort(wrapper, entity);
        wrapper.orderByDesc(this.getSortedFieldColumnName());
        wrapper.select(String.format("IFNULL(max(%s), -1) as value", getSortedFieldColumnName()));
        List<Map<String, Object>> result = baseMapper.selectMaps(wrapper);
        return Integer.parseInt(result.get(0).get("value") + "");
    }

    /**
     * 返回实体的父节点，可以子类覆盖重写
     *
     * @param entity
     * @return
     */
    public Serializable getEntityId(T entity) {
        return (Serializable) ReflectUtil.getFieldValue(entity, this.getTreeIdFieldName());
    }

    /**
     * 返回实体的父节点，可以子类覆盖重写
     *
     * @param entity
     * @return
     */
    protected Serializable getEntityParentId(T entity) {
        return (Serializable) ReflectUtil.getFieldValue(entity, this.getTreeParentIdFieldName());
    }

    /**
     * 设置父节点ID为默认的顶级根节点ID
     * @param entity
     */
    protected void setEntityParentId(T entity) {
        ReflectUtil.setFieldValue(entity, this.getTreeParentIdFieldName(), getRootId());
    }

    /**
     * 返回实体的父节点，可以子类覆盖重写
     *
     * @param entity
     * @return
     */
    protected Object getEntityName(T entity) {
        return ReflectUtil.getFieldValue(entity, this.getTreeNameFieldName());
    }

    /**
     * 返回实体的父节点，可以子类覆盖重写
     *
     * @param entity
     * @return
     */
    protected Integer getEntitySortId(T entity) {
        Object sortId = ReflectUtil.getFieldValue(entity, this.getSortedFieldName());
        if (sortId == null) {
            return 0;
        }
        int sort = 0;
        try {
            sort = Integer.parseInt(ObjectUtil.toString(sortId));
        } catch (Exception e) {
            _logger.error(e.getMessage(), e);
        }
        return sort;
    }


    /**
     * 通用Tree类型数据向下查询
     *
     * @param id 要查询的根节点ID
     * @return 返回要查询的根节点向下所有节点的平铺List（包含id节点）
     */
    public List<T> findAllChildren(Serializable id) {
        List<T> list = new ArrayList<>();

        // 查询顶部节点
        T topItem = super.getById(id);
        if (topItem == null) {
            return new ArrayList<>();
        }

        list.add(topItem);

        Serializable topItemId = getEntityId(topItem);
        List<T> children = this.findChildren(topItemId);
        list.addAll(children);

        return list;
    }

    /**
     * 通用Tree类型数据向下递归查询
     *
     * @param parentId 要查询的父节点ID
     * @return 返回要查询的根节点向下所有节点的平铺List（不包含parentId节点）
     */
    public List<T> findChildren(Serializable parentId) {
        List<T> list = new ArrayList<>();

        QueryWrapper<T> wrapper = new QueryWrapper<>();
        wrapper.eq(getTreeParentIdFieldColumnName(), parentId);

        List<T> children = super.list(wrapper);
        if (children != null && !children.isEmpty()) {
            list.addAll(children);
            children.forEach(child -> {
                Serializable childItemId = getEntityId(child);
                list.addAll(findChildren(childItemId));
            });
        }
        return list;
    }

    protected TreeNode<T> transEntityToTreeNode(T entity) {
        return this.transEntityToTreeNode(entity, true);
    }

    /**
     * 将实体T转换为TreeNode节点
     * @param entity 实体
     * @param countChildren 是否统计自节点数量
     * @return
     */
    protected TreeNode<T> transEntityToTreeNode(T entity, boolean countChildren) {
        TreeNode<T> treeNode = new TreeNode<>();
        treeNode.setId(this.getEntityId(entity));
        treeNode.setParentId(this.getEntityParentId(entity));
        treeNode.setName(ObjectUtil.toString(this.getEntityName(entity)));
        // 判断节点是否还有子节点
        if (countChildren) {
            treeNode.setHasChildren(this.treeCountLayer(this.getEntityId(entity)) > 0);
        }
        treeNode.setSourceData(entity);
        return treeNode;
    }

    public List<TreeNode<T>> transEntityListToNodeList(List<T> list) {
        if (list == null || list.isEmpty()) {
            return new ArrayList<>();
        }
        return list.stream().map(this::transEntityToTreeNode).collect(Collectors.toList());
    }

    protected String getSortedFieldColumnName() {
        return StrUtil.toUnderlineCase(this.getAnnotationFieldName(SqlSorter.class));
    }

    protected String getSortedFieldName() {
        return this.getAnnotationFieldName(SqlSorter.class);
    }

    protected String getTreeIdFieldName() {
        return this.getAnnotationFieldName(SqlTreeId.class);
    }

    protected String getTreeParentIdFieldName() {
        return this.getAnnotationFieldName(SqlTreeParentId.class);
    }

    protected String getTreeParentIdFieldColumnName() {
        return StrUtil.toUnderlineCase(this.getAnnotationFieldName(SqlTreeParentId.class));
    }

    protected String getTreeNameFieldName() {
        return this.getAnnotationFieldName(SqlTreeName.class);
    }

    protected String getTreeNameFieldColumnName() {
        return StrUtil.toUnderlineCase(this.getAnnotationFieldName(SqlTreeName.class));
    }

}
