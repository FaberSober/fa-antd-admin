package com.faber.core.config.mybatis.base;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.conditions.query.QueryChainWrapper;
import com.baomidou.mybatisplus.extension.conditions.update.LambdaUpdateChainWrapper;
import com.baomidou.mybatisplus.extension.conditions.update.UpdateChainWrapper;
import org.apache.ibatis.annotations.Param;

import java.io.Serializable;

/**
 * @author K
 * @since 2019/7/9
 */
public interface FaBaseMapper<T> extends BaseMapper<T> {

    /* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓  ↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

    /**
     * 以下定义的 4个 default method, copy from {@link com.baomidou.mybatisplus.extension.toolkit.ChainWrappers}
     */
    default QueryChainWrapper<T> queryChain() {
        return new QueryChainWrapper<>(this);
    }

    default LambdaQueryChainWrapper<T> lambdaQueryChain() {
        return new LambdaQueryChainWrapper<>(this);
    }

    default UpdateChainWrapper<T> updateChain() {
        return new UpdateChainWrapper<>(this);
    }

    default LambdaUpdateChainWrapper<T> lambdaUpdateChain() {
        return new LambdaUpdateChainWrapper<>(this);
    }


    // 添加拦截忽略注解，指定忽略全表删除拦截器

    /**
     * 删除全表数据，谨慎使用！
     */
//    @InterceptorIgnore(blockAttack = "true")
//    int deleteAll();

    /**
     * 删除全表数据，谨慎使用！
     */
//    @InterceptorIgnore(blockAttack = "true")
//    int deleteAllIgnoreLogic();

    // ----------------------------------- 自定义追加的忽略逻辑删除字段的操作 -----------------------------------
    /**
     * 根据 ID 删除，不受逻辑删除字段限制，物理永久删除
     * @param id 主键ID
     */
    int deleteByIdIgnoreLogic(Serializable id);

    /**
     * 根据实体(ID)删除，不受逻辑删除字段限制，物理永久删除
     *
     * @param entity 实体对象
     * @since 3.4.4
     */
    int deleteByIdIgnoreLogic(T entity);

    /**
     * 根据 ID 查询，不受逻辑删除字段限制
     * @param id 主键ID
     */
    T selectByIdIgnoreLogic(Serializable id);

    /**
     * 根据 ID 修改
     * @param entity 实体对象
     */
    int updateByIdIgnoreLogic(@Param(Constants.ENTITY) T entity);

}
