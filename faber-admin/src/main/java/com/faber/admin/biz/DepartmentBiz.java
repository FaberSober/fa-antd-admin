package com.faber.admin.biz;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import com.faber.admin.entity.Department;
import com.faber.admin.entity.User;
import com.faber.admin.mapper.DepartmentMapper;
import com.faber.admin.vo.DepartmentInfo;
import com.faber.admin.vo.DepartmentPageVo;
import com.faber.common.biz.BaseTreeBiz;
import com.faber.common.exception.BuzzException;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.vo.Query;
import com.faber.common.vo.query.QueryParams;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.List;
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

    @Resource
    private DictBiz dictBiz;

    @Override
    public boolean save(Department entity) {
        super.setNextSort(entity); // 设置entity的排序
        return super.save(entity);
    }

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
    public TableResultResponse<Department> selectPageByQuery(QueryParams query) {
        TableResultResponse<Department> table = super.selectPageByQuery(query);

        List<Department> list = table.getData().getRows().stream().map(this::decorate).collect(Collectors.toList());
        table.getData().setRows(list);

        return table;
    }

    public DepartmentPageVo decorate(Department entity) {
        DepartmentPageVo vo = new DepartmentPageVo();
        BeanUtil.copyProperties(entity, vo);

        vo.setManager(userBiz.findUserInfoById(vo.getManagerId()));
        return vo;
    }

    public DepartmentInfo getInfoById(String id) {
        Department entity = getById(id);

        DepartmentInfo info = new DepartmentInfo();
        BeanUtil.copyProperties(entity, info);

        info.setManager(userBiz.findUserInfoById(info.getManagerId()));

        switch (Department.Type.valueOf(info.getType())) {
            case CORP:
            case DEPT:
                // 公司、部门的所属部门为自身
                info.setBelongDept(entity);
                break;
            case TEAM:
                // 班组，向上查找部门
                info.setBelongDept(this.findUpDept(entity));
                break;
        }

        return info;
    }

    public Department findUpDept(Department entity) {
        if (entity == null) return null;
        if ("-1".equalsIgnoreCase(entity.getParentId())) {
            return entity;
        }
        if (Department.Type.CORP.value.equalsIgnoreCase(entity.getType()) || Department.Type.DEPT.value.equalsIgnoreCase(entity.getType())) {
            return entity;
        }
        return findUpDept(getById(entity.getParentId()));
    }

}
