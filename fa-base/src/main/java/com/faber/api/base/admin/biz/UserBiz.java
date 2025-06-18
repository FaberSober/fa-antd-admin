package com.faber.api.base.admin.biz;

import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.collection.IterUtil;
import cn.hutool.core.lang.UUID;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
//import com.alicp.jetcache.anno.CacheInvalidate;
//import com.alicp.jetcache.anno.Cached;
import com.faber.core.enums.SexEnum;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.faber.api.base.admin.entity.Department;
import com.faber.api.base.admin.entity.User;
import com.faber.api.base.admin.entity.UserToken;
import com.faber.api.base.admin.mapper.UserMapper;
import com.faber.api.base.admin.vo.query.*;
import com.faber.api.base.rbac.biz.RbacRoleBiz;
import com.faber.api.base.rbac.biz.RbacUserRoleBiz;
import com.faber.api.base.rbac.entity.RbacRole;
import com.faber.config.utils.user.UserCheckUtil;
import com.faber.core.config.redis.annotation.FaCacheClear;
import com.faber.core.constant.CommonConstants;
import com.faber.core.constant.FaSetting;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.exception.BuzzException;
import com.faber.core.exception.NoDataException;
import com.faber.core.exception.auth.UserInvalidException;
import com.faber.core.utils.FaPwdUtils;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.web.biz.BaseBiz;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.redisson.api.RedissonClient;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


/**
 * 用户
 *
 * @author wanghaobin
 * @create 2017-06-08 16:23
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class UserBiz extends BaseBiz<UserMapper, User> {

    @Lazy
    @Resource
    private DepartmentBiz departmentBiz;

    @Lazy
    @Resource
    private RbacUserRoleBiz rbacUserRoleBiz;

    @Lazy
    @Resource
    private RbacRoleBiz rbacRoleBiz;

    @Lazy
    @Resource
    private UserTokenBiz userTokenBiz;

    @Resource
    private FaSetting faSetting;

    @Autowired
    private RedissonClient redisson;

    @Value("${spring.data.redis.prefix}")
    private String redisPrefix;

    /**
     * 登录账户
     *
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

        if (!FaPwdUtils.checkPwd(password, user.getPassword())) {
            throw new UserInvalidException("用户名或密码错误！");
        }
        return user;
    }

    /**
     * 验证当前登录账户的密码是否正确
     *
     * @param password
     */
    public void validateCurrentUserPwd(String password) {
        User user = this.getByIdWithCache(getCurrentUserId());
        UserCheckUtil.checkUserValid(user);
        if (FaPwdUtils.checkPwd(password, user.getPassword())) {
            return;
        }
        throw new UserInvalidException("本账户密码验证失败");
    }

    public User getLoginUser() {
        User user = getById(getCurrentUserId());
        if (!user.getStatus()) throw new BuzzException("无效账户");
        user.setPassword(null);
        return user;
    }

    /**
     * 新增、编辑时，校验数据合理性
     *
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
     *
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

//    @Cached(name = "user:", key = "#id")
    @Override
    public User getById(Serializable id) {
        return super.getById(id);
    }

    @Override
    public boolean save(User entity) {
        this.checkBeanValid(entity);

        // 密码加密存储
        String password = FaPwdUtils.encryptPwd(entity.getPassword());
        entity.setPassword(password);

        super.save(entity);

        this.updateUserRoles(entity);

        return true;
    }

//    @CacheInvalidate(name = "user:", key = "#entity.id")
    @FaCacheClear(pre = "rbac:userMenus:", key = "id")
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

    /**
     * 限定一些属性的简单更新
     * @param entity
     * @return
     */
//    @CacheInvalidate(name = "user:", key = "#entity.id")
    @FaCacheClear(pre = "rbac:userMenus:", key = "id")
    public boolean updateSimpleById(User entity) {
        // 可以更新的属性
        return lambdaUpdate()
                .set(entity.getStatus() != null, User::getStatus, entity.getStatus())
                .eq(User::getId, entity.getId())
                .update();
    }

//    @CacheInvalidate(name = "user:", key = "#id")
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
    public User getUserByUsername(String username) {
        return lambdaQuery().eq(User::getUsername, username).one();
    }

    public User getUserByTel(String tel) {
        return lambdaQuery().eq(User::getTel, tel).one();
    }

    public User findByApiToken(String token) {
        if (StringUtils.isEmpty(token)) throw new BuzzException("token为空");

        return lambdaQuery().eq(User::getApiToken, token).one();
    }

    @Override
    protected void preProcessQuery(QueryParams query) {
        // 部门分组级联查询
        Map<String, Object> queryMap = query.getQuery();
        if (queryMap.containsKey("departmentIdSuper")) {
            String departmentId = MapUtils.getString(queryMap, "departmentIdSuper");
            queryMap.remove("departmentIdSuper");

            List<Department> departmentList = departmentBiz.findAllChildren(departmentId);
            if (departmentList != null && !departmentList.isEmpty()) {
                List<String> departmentIdList = departmentList.stream().map(Department::getId).collect(Collectors.toList());
                queryMap.put("departmentId#$in", departmentIdList);
                queryMap.remove("departmentId");
            }
        }
    }

    @Override
    public void decorateOne(User i) {
        Department department = departmentBiz.getByIdWithCache(i.getDepartmentId());
        if (department != null) {
            i.setDepartmentName(department.getName());
        }
    }

    public boolean resetPwd(Map<String, Object> params) {
        Integer id = (Integer) params.get("id");
        String newPwd = (String) params.get("newPwd");

        User beanDB = getById(id);
        if (beanDB == null) throw new NoDataException();

        String password = FaPwdUtils.encryptPwd(newPwd);
        beanDB.setPassword(password);
        return super.updateById(beanDB);
    }

//    @CacheInvalidate(name = "user:", key = "#userId")
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
        // 手动处理 sex 字段的转换
        if (vo.getSex() != null) {
            SexEnum sexEnum = SexEnum.fromValue(vo.getSex());
            user.setSex(sexEnum);
        }
        BeanUtils.copyProperties(vo, user,"sex");
        return super.updateById(user);
    }

//    @CacheInvalidate(name = "user:", key = "#userId")
    public boolean updateMyPwd(String userId, Map<String, Object> params) {
        String oldPwd = (String) params.get("oldPwd");
        String newPwd = (String) params.get("newPwd");

        if (oldPwd.equals(newPwd)) throw new BuzzException("新旧密码不能一样");

        User user = getById(userId);

        this.validateCurrentUserPwd(oldPwd);

        String password = FaPwdUtils.encryptPwd(newPwd);
        user.setPassword(password);
        return super.updateById(user);
    }

//    @CacheInvalidate(name = "user:", key = "#userId")
    public boolean updateMyApiToken(String userId) {
        User user = getById(userId);
        user.setApiToken(UUID.fastUUID().toString(true));
        return super.updateById(user);
    }

    @Transactional
    public void updateBatchDept(UserBatchUpdateDeptVo params) {
        lambdaUpdate()
                .set(User::getDepartmentId, params.getDepartmentId())
                .in(User::getId, params.getUserIds())
                .update();

        delUserCacheByIds(params.getUserIds());
    }

    @Transactional
    public void updateBatchRole(UserBatchUpdateRoleVo params) {
        params.getUserIds().forEach(userId -> {
            rbacUserRoleBiz.changeUserRoles(userId, params.getRoleIds());
        });

        delUserCacheByIds(params.getUserIds());
    }

    public void updateBatchPwd(UserBatchUpdatePwdVo params) {
        this.validateCurrentUserPwd(params.getPasswordCheck());

        String newPwd = params.getNewPwd();
        if (StringUtils.isEmpty(newPwd)) {
            throw new BuzzException("新密码不能为空");
        }

        // TODO 根据系统配置验证密码合法性
//        if (newPwd.trim().length() < 6 || newPwd.trim().length() > 32) {
//            throw new BuzzException("新密码长度错误");
//        }

        String password = FaPwdUtils.encryptPwd(newPwd.trim());
        params.getUserIds().forEach(id -> {
            User user = getById(id);
            user.setPassword(password);
            super.updateById(user);
        });
    }

    public void delUserCacheByIds(List<String> userIds) {
        userIds.forEach(i -> {
            delUserCacheById(i);
        });
    }

    public void delUserCacheById(String userId) {
        redisson.getKeys().deleteByPattern(redisPrefix + ":user:" + userId);
    }

    public void accountAdminDelete(Map<String, Object> params) {
        String passwordCheck = (String) params.get("passwordCheck");
        List<Integer> ids = (List<Integer>) params.get("ids");

        this.validateCurrentUserPwd(passwordCheck);

        ids.forEach(id -> {
            removeById(id);
        });
    }

    public User getUserFromApiToken() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String token = request.getHeader(faSetting.getApi().getTokenApiHeader());
        if (StrUtil.isEmpty(token)) throw new BuzzException("Token Is Empty");
        UserToken userToken = userTokenBiz.getById(token);
        if (userToken == null || !userToken.getValid()) throw new BuzzException("Token Not Valid");

        return super.getById(userToken.getUserId());
    }

    public Long jumpCount(UserJumpCountVo query) {
        if (ObjectUtil.isAllEmpty(query.getUsername(), query.getTel())) return 0L;
        return lambdaQuery()
                .eq(query.getUsername() != null, User::getUsername, query.getUsername())
                .eq(query.getTel() != null, User::getTel, query.getTel())
                .count();
    }

    public void registry(UserRegistryVo params) {
        User entity = new User();
        BeanUtils.copyProperties(params, entity);

        this.checkBeanValid(entity);

        // 密码加密
        String password = FaPwdUtils.encryptPwd(params.getPassword());
        entity.setPassword(password);

        entity.setStatus(true);
        entity.setDepartmentId("1");

        super.save(entity);

        // 设置初始角色
        RbacRole rbacRole = rbacRoleBiz.getRoleByName(CommonConstants.REGISTRY_USER_ROLE_NAME);
        entity.setRoleId(rbacRole.getId());

        this.updateUserRoles(entity);
    }

    public void forgetResetPwd(UserForgetResetPwdVo params) {
        LambdaQueryChainWrapper<User> chainWrapper = lambdaQuery()
                .eq(User::getUsername, params.getUsername())
                .eq(User::getTel, params.getTel());
        long count = chainWrapper.count();
        if (count != 1) throw new BuzzException("未找到匹配账户，请确认账户、手机号");

        User user = chainWrapper.one();

        String password = FaPwdUtils.encryptPwd(params.getPassword());
        lambdaUpdate()
                .set(User::getPassword, password)
                .eq(User::getId, user.getId())
                .update();
    }

    public void setUserLogin(String userId) {
        setUserLogin(userId, "web");
    }

    public void setUserLogin(User user) {
        setUserLogin(user, "web");
    }

    public void setUserLogin(String userId, String device) {
        User user = super.getById(userId);
        this.setUserLogin(user, device);
    }

    public void setUserLogin(User user, String device) {
        UserCheckUtil.checkUserValid(user);

        BaseContextHandler.setUsername(user.getUsername());
        BaseContextHandler.setName(user.getName());
        BaseContextHandler.setUserId(user.getId());
        BaseContextHandler.setLogin(true);

        // 更新用户最后在线时间
        this.lambdaUpdate()
                .eq(User::getId, user.getId())
                .set(User::getLastOnlineTime, new Date())
                .update();
    }

    /**
     * 通过姓名获取用户（带缓存）（重复姓名取top）
     * 注意：这里用户数量较多的话，可能会导致用户名重复的问题，自行斟酌使用
     * @param name {@link User#getName()}
     * @return {@link User}
     */
    public User getByNameWithCache(String name) {
        Map<Serializable, User> cache = BaseContextHandler.getCacheMap("UserBiz.getByNameWithCache");
        if (cache.containsKey(name)) {
            return cache.get(name);
        }

        User entity = getTop(
                lambdaQuery()
                        .eq(User::getName, name)
                        .orderByDesc(User::getId)
        );
        cache.put(name, entity);
        return entity;
    }

    @Override
    public User getDetailById(Serializable id) {
        // 调用父类的方法获取基本数据
        User user = super.getById(id);
        this.populateUserRoles(user);
        return user;
    }
    /**
     * 根据用户的ID查找角色信息
     *
     * @param user
     */
    private void populateUserRoles(User user) {
        if (user != null && user.getId() != null) {
            // 查找与当前用户相关的角色数据
            List<Long> userRoles = rbacUserRoleBiz.getUserRoleIds(user.getId());
            // 处理角色信息，假设返回的是一个角色列表
            if (userRoles != null && !userRoles.isEmpty()) {
                user.setRoleIds(userRoles);
            }
        }
    }
}
