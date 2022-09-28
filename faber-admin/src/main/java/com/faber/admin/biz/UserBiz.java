package com.faber.admin.biz;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.lang.UUID;
import cn.hutool.core.util.ObjectUtil;
import com.ace.cache.api.CacheAPI;
import com.faber.admin.entity.Department;
import com.faber.admin.entity.User;
import com.faber.admin.mapper.UserMapper;
import com.faber.admin.util.user.UserCheckUtil;
import com.faber.admin.vo.UserAccountVo;
import com.faber.admin.vo.UserInfo;
import com.faber.admin.vo.UserWeb;
import com.faber.common.biz.BaseBiz;
import com.faber.common.constant.CommonConstants;
import com.faber.common.context.BaseContextHandler;
import com.faber.common.enums.BoolEnum;
import com.faber.common.enums.DictTypeCodeEnum;
import com.faber.common.exception.BuzzException;
import com.faber.common.exception.NoDataException;
import com.faber.common.exception.auth.UserInvalidException;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.vo.Query;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.ArrayList;
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

    @Override
    public boolean save(User entity) {
        this.checkBeanValid(entity);

        // 初始化密码888888
        String password = new BCryptPasswordEncoder(CommonConstants.PW_ENCODER_SALT).encode("888888");
        entity.setPassword(password);

        super.save(entity);

        // 关联角色
//        groupUserBiz.changeUserGroup(entity.getId(), entity.getGroupIds());

        return true;
    }

    @Override
    public boolean updateById(User entity) {
        User beanDB = getById(entity.getId());
        if (beanDB == null) throw new NoDataException();

        this.checkBeanValid(entity);

        // 修改用户，不能修改用户密码
        entity.setPassword(beanDB.getPassword());

        // 关联角色
//        groupUserBiz.changeUserGroup(entity.getId(), entity.getGroupIds());

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
    protected void preProcessQuery(Query query) {
        // 部门分组级联查询
        if (query.containsKey("departmentId")) {
            String departmentId = MapUtils.getString(query, "departmentId");

            List<Department> departmentList = departmentBiz.findAllChildren(departmentId);
            if (departmentList != null && !departmentList.isEmpty()) {
                List<String> departmentIdList = departmentList.stream().map(Department::getId).collect(Collectors.toList());
                query.put("departmentId#$in", departmentIdList);
                query.remove("departmentId");
            }
        }
    }

    @Override
    public TableResultResponse<User> selectPageByQuery(Query query) {
        TableResultResponse<User> userTable = super.selectPageByQuery(query);

        List<User> list = new ArrayList<>();
        userTable.getData().getRows().forEach(user -> {
            UserWeb userWeb = new UserWeb();
            BeanUtil.copyProperties(user, userWeb);

            // 获取部门信息
            Department department = departmentBiz.getById(user.getDepartmentId());
            if (department != null) {
                userWeb.setDepartmentName(department.getName());
            }

            userWeb.setPassword(null);

            list.add(userWeb);
        });
        userTable.getData().setRows(list);

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
        return updateById(beanDB);
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
        return updateById(user);
    }

//    @CacheClear(pre = "user{1}")
    public boolean updateMyApiToken(String userId) {
        User user = getById(userId);
        user.setApiToken(UUID.fastUUID().toString(true));
        return updateById(user);
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
            updateById(user);

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

    @Deprecated
    public UserInfo findUserInfoById(String id) {
        if (id == null) return null;
        User user = getById(id);
        if (user == null) return null;
        UserInfo userInfo = new UserInfo();
        BeanUtil.copyProperties(user, userInfo);
        return userInfo;
    }

}
