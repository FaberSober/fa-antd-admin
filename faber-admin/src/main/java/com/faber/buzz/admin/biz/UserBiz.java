package com.faber.buzz.admin.biz;

import cn.hutool.core.collection.IterUtil;
import cn.hutool.core.lang.UUID;
import cn.hutool.core.util.ObjectUtil;
import com.ace.cache.api.CacheAPI;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.faber.buzz.admin.entity.Department;
import com.faber.buzz.admin.entity.User;
import com.faber.buzz.admin.enums.DictTypeCodeEnum;
import com.faber.buzz.admin.mapper.UserMapper;
import com.faber.buzz.admin.vo.query.UserAccountVo;
import com.faber.buzz.rbac.biz.RbacUserRoleBiz;
import com.faber.buzz.rbac.entity.RbacRole;
import com.faber.config.utils.user.UserCheckUtil;
import com.faber.core.constant.CommonConstants;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.enums.BoolEnum;
import com.faber.core.exception.BuzzException;
import com.faber.core.exception.NoDataException;
import com.faber.core.exception.auth.UserInvalidException;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.web.biz.BaseBiz;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 用户业务信息
 *
 * @author wanghaobin
 * @create 2017-06-08 16:23
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class UserBiz extends BaseBiz<UserMapper, User> {

    @Resource
    private CacheAPI cacheAPI;

    @Resource
    private DictBiz dictBiz;

    @Lazy
    @Resource
    private DepartmentBiz departmentBiz;

    @Lazy
    @Resource
    private RbacUserRoleBiz rbacUserRoleBiz;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    /**
     * 登录账户
     * @param account
     * @param password
     * @return
     */
    public User validate(String account, String password) {
        User user = this.getUserByUsername(account);
        if (user == null) {
            user = this.getUserByTel(account);
        }
        UserCheckUtil.checkUserValid(user);

        if (!encoder.matches(password, user.getPassword())) {
            throw new UserInvalidException("用户名或密码错误！");
        }
        return user;
    }

    public void validateCurrentUserPwd(String password) {
        User user = this.getUserByUsername(BaseContextHandler.getUsername());
        UserCheckUtil.checkUserValid(user);
        if (encoder.matches(password, user.getPassword())) {
            return;
        }
        throw new UserInvalidException("密码验证失败");
    }

    public User getLoginUser() {
        User user = getUserById(BaseContextHandler.getUserId());
        if (user.getStatus() == BoolEnum.NO) throw new BuzzException("无效账户");
        user.setPassword(null);
        return user;
    }

    /**
     * 新增、编辑时，校验数据合理性
     * @param entity
     */
    private void checkBeanValid(User entity) {
        // 插入时校验手机号是否重复
        long telCount = lambdaQuery()
                .eq(User::getTel, entity.getTel())
                .ne(entity.getId() != null, User::getId, entity.getId())
                .count();
        if (telCount > 0) throw new BuzzException("手机号重复");

        // 校验用户名是否重复
        long usernameCount = lambdaQuery()
                .eq(User::getUsername, entity.getUsername())
                .ne(entity.getId() != null, User::getId, entity.getId())
                .count();
        if (usernameCount > 0) throw new BuzzException("账户重复");
    }

    /**
     * 更新用户角色
     * @param entity
     */
    public void updateUserRoles(User entity) {
        // 关联角色
        rbacUserRoleBiz.changeUserRoles(entity.getId(), entity.getRoleIds());
        // 冗余角色名称
        List<RbacRole> roleList = rbacUserRoleBiz.getUserRoles(entity.getId());
        String roleNames = IterUtil.join(roleList.stream().map(RbacRole::getName).iterator(), ",");

        lambdaUpdate().eq(User::getId, entity.getId()).set(User::getRoleNames, roleNames).update();
        entity.setRoleNames(roleNames);
    }

    @Override
    public boolean save(User entity) {
        this.checkBeanValid(entity);

        // 初始化密码888888
        String password = new BCryptPasswordEncoder(CommonConstants.PW_ENCODER_SALT).encode(entity.getPassword());
        entity.setPassword(password);

        super.save(entity);

        this.updateUserRoles(entity);

        return true;
    }

    @Override
    public boolean updateById(User entity) {
        User beanDB = getById(entity.getId());
        if (beanDB == null) throw new NoDataException();

        this.checkBeanValid(entity);

        // 修改用户，不能修改用户密码
        entity.setPassword(beanDB.getPassword());

        this.updateUserRoles(entity);

        return super.updateById(entity);
    }

    @Override
    public boolean removeById(Serializable id) {
        // 不能删除自身账户和admin账户
        if (ObjectUtil.equal(id, "1") || ObjectUtil.equal(id, getCurrentUserId())) {
            throw new BuzzException("不能删除自身账户");
        }

        return super.removeById(id);
    }


    /**
     * 根据用户名获取用户信息 FIX-ME: 用户名不一定唯一，感觉换成ID会更好
     *
     * @param username 用户名
     */
//    @Cache(key = "user{1}")
    public User getUserByUsername(String username) {
        return lambdaQuery().eq(User::getUsername, username).one();
    }

    public User getUserByTel(String tel) {
        return lambdaQuery().eq(User::getTel, tel).one();
    }

//    @Cache(key = "user{1}")
    public User getUserById(String id) {
        return getById(id);
    }

    public User findByApiToken(String token) {
        if (StringUtils.isEmpty(token)) throw new BuzzException("token为空");

        return lambdaQuery().eq(User::getApiToken, token).one();
    }

    @Override
    protected void preProcessQuery(QueryParams query) {
        // 部门分组级联查询
        Map<String, Object> queryMap = query.getQueryMap();
        if (queryMap.containsKey("departmentId")) {
            String departmentId = MapUtils.getString(queryMap, "departmentId");

            List<Department> departmentList = departmentBiz.findAllChildren(departmentId);
            if (departmentList != null && !departmentList.isEmpty()) {
                List<String> departmentIdList = departmentList.stream().map(Department::getId).collect(Collectors.toList());
                queryMap.put("departmentId#$in", departmentIdList);
                queryMap.remove("departmentId");
            }
        }
    }

    /**
     * 关联查询和QueryParams的处理过于复杂，不太利于复用，暂不优化
     * @param query
     * @return
     */
    @Deprecated
    public TableRet<User> pageJoin(QueryParams query) {
        // 处理map
        for (Map.Entry<String, Object> entry : query.getQueryMap().entrySet()) {
            if ("departmentName".equals(entry.getKey())) {
                query.getQueryMap().put("d.name", entry.getValue());
            } else {
                query.getQueryMap().put("t." + entry.getKey(), entry.getValue());
            }
            query.getQueryMap().remove(entry.getKey());
        }

        QueryWrapper<User> wrapper = parseQuery(query);
        if (query.getPageSize() > 1000) throw new BuzzException("查询结果数量大于1000，请缩小查询范围");

        wrapper.eq("t.del_state", 0);
        wrapper.eq("d.del_state", 0);

        PageInfo<User> result = PageHelper.startPage(query.getCurrent(), query.getPageSize())
                .doSelectPageInfo(() -> baseMapper.listJoin(wrapper));
        TableRet<User> userTable = new TableRet<>(result);

        // 枚举值
        userTable.getData().addDict("status", dictBiz.getByCode(DictTypeCodeEnum.COMMON_USER_STATUS));
        userTable.getData().addDict("sex", dictBiz.getByCode(DictTypeCodeEnum.COMMON_SEX));

        return userTable;
    }

    @Override
    public TableRet<User> selectPageByQuery(QueryParams query) {
        TableRet<User> userTable =  super.selectPageByQuery(query);

        userTable.getData().getRows().forEach(i -> {
            Department department = departmentBiz.getByIdWithCache(i.getDepartmentId());
            i.setDepartmentName(department.getName());
        });

        // 枚举值
        userTable.getData().addDict("status", dictBiz.getByCode(DictTypeCodeEnum.COMMON_USER_STATUS));
        userTable.getData().addDict("sex", dictBiz.getByCode(DictTypeCodeEnum.COMMON_SEX));

        return userTable;
    }

    public boolean resetPwd(Map<String, Object> params) {
        Integer id = (Integer) params.get("id");
        String newPwd = (String) params.get("newPwd");

        User beanDB = getById(id);
        if (beanDB == null) throw new NoDataException();

        String password = new BCryptPasswordEncoder(CommonConstants.PW_ENCODER_SALT).encode(newPwd);
        beanDB.setPassword(password);
        return super.updateById(beanDB);
    }

//    @CacheClear(pre = "user{1}")
    public boolean updateMine(String userId, UserAccountVo vo) {
        // 插入时校验手机号是否重复
        long telCount = lambdaQuery()
                .eq(User::getTel, vo.getTel())
                .ne(User::getId, userId)
                .count();
        if (telCount > 0) throw new BuzzException("手机号重复");

        // 校验用户名是否重复
        long usernameCount = lambdaQuery()
                .eq(User::getUsername, vo.getUsername())
                .ne(User::getId, userId)
                .count();
        if (usernameCount > 0) throw new BuzzException("账户重复");

        User user = getById(userId);
        BeanUtils.copyProperties(vo, user);

        return super.updateById(user);
    }

//    @CacheClear(pre = "user{1}")
    public boolean updateMyPwd(String userId, Map<String, Object> params) {
        String oldPwd = (String) params.get("oldPwd");
        String newPwd = (String) params.get("newPwd");

        if (oldPwd.equals(newPwd)) throw new BuzzException("新旧密码不能一样");

        User user = getById(userId);

        this.validateCurrentUserPwd(oldPwd);

        String password = new BCryptPasswordEncoder(CommonConstants.PW_ENCODER_SALT).encode(newPwd);
        user.setPassword(password);
        return super.updateById(user);
    }

//    @CacheClear(pre = "user{1}")
    public boolean updateMyApiToken(String userId) {
        User user = getById(userId);
        user.setApiToken(UUID.fastUUID().toString(true));
        return super.updateById(user);
    }

    public void accountAdminUpdatePwd(Map<String, Object> params) {
        String newPwd = (String) params.get("newPwd");
        String passwordCheck = (String) params.get("passwordCheck");
        List<Integer> ids = (List<Integer>) params.get("ids");

        this.validateCurrentUserPwd(passwordCheck);

        if (StringUtils.isEmpty(newPwd)) {
            throw new BuzzException("新密码不能为空");
        }

        if (newPwd.trim().length() < 6 || newPwd.trim().length() > 32) {
            throw new BuzzException("新密码长度错误");
        }

        String password = new BCryptPasswordEncoder(CommonConstants.PW_ENCODER_SALT).encode(newPwd.trim());
        ids.forEach(id -> {
            User user = getById(id);
            user.setPassword(password);
            super.updateById(user);

            cacheAPI.removeByPre("user:" + id);
        });
    }

    public void accountAdminDelete(Map<String, Object> params) {
        String passwordCheck = (String) params.get("passwordCheck");
        List<Integer> ids = (List<Integer>) params.get("ids");

        this.validateCurrentUserPwd(passwordCheck);

        ids.forEach(id -> {
            removeById(id);
            cacheAPI.removeByPre("user:" + id);
        });
    }

}
