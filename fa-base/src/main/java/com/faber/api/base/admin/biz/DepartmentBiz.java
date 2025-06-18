package com.faber.api.base.admin.biz;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import com.faber.api.base.admin.entity.Department;
import com.faber.api.base.admin.entity.User;
import com.faber.api.base.admin.mapper.DepartmentMapper;
import com.faber.api.base.admin.vo.ret.DepartmentVo;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.exception.BuzzException;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.web.biz.BaseTreeBiz;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Base-部门
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-07 19:26:53
 */
@Service
public class DepartmentBiz extends BaseTreeBiz<DepartmentMapper, Department> {

    @Resource
    private UserBiz userBiz;

    @Override
    public boolean updateById(Department entity) {
        if (ObjectUtil.equal(entity.getParentId(), entity.getId())) {
            throw new BuzzException("父节点不能是自身");
        }
        return super.updateById(entity);
    }

    @Override
    public boolean removeById(Serializable id) {
        // 删除部门，检查部门下是否还有员工
        long count = userBiz.lambdaQuery().eq(User::getDepartmentId, id).count();
        if (count > 0) {
            throw new BuzzException("该部门名下仍有员工，无法删除部门，请确认");
        }
        return super.removeById(id);
    }

    @Override
    public TableRet<Department> selectPageByQuery(QueryParams query) {
        TableRet<Department> table = super.selectPageByQuery(query);

        List<Department> list = table.getData().getRows().stream().map(this::decorate).collect(Collectors.toList());
        table.getData().setRows(list);

        return table;
    }

    public DepartmentVo decorate(Department entity) {
        DepartmentVo vo = new DepartmentVo();
        BeanUtil.copyProperties(entity, vo);

        vo.setManager(userBiz.getByIdWithCache(vo.getManagerId()));
        return vo;
    }

    public Department getByNameWithCache(String name) {
        Map<Serializable, Department> cache = BaseContextHandler.getCacheMap("DepartmentBiz.getByNameWithCache");
        if (cache.containsKey(name)) {
            return cache.get(name);
        }

        Department entity = getTop(
                lambdaQuery()
                        .eq(Department::getName, name)
                        .orderByDesc(Department::getId)
        );
        cache.put(name, entity);
        return entity;
    }

}
