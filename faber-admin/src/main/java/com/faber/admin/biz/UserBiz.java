package com.faber.admin.biz;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.lang.UUID;
import cn.hutool.core.util.ObjectUtil;
import com.ace.cache.api.CacheAPI;
import com.faber.admin.mapper.UserMapper;
import com.faber.admin.entity.Department;
import com.faber.admin.entity.User;
import com.faber.admin.vo.UserAccountVo;
import com.faber.admin.vo.UserInfo;
import com.faber.admin.vo.UserWeb;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.biz.BaseBiz;
import com.faber.common.constant.DictConstants;
import com.faber.common.constant.UserConstant;
import com.faber.common.exception.BuzzException;
import com.faber.common.exception.NoDataException;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.util.Query;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.entity.Example;

import javax.annotation.Resource;
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

    @Resource
    private PermissionBiz permissionBiz;

    @Resource
    private DepartmentBiz departmentBiz;

    @Resource
    private GroupUserBiz groupUserBiz;

    /**
     * 新增、编辑时，校验数据合理性
     * @param entity
     */
    private void checkBeanValid(User entity) {
        // 插入时校验手机号是否重复
        Example example = new Example(User.class);
        Example.Criteria criteria = example.createCriteria()
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("mobilePhone", entity.getMobilePhone());
        if (entity.getId() != null) {
            criteria.andNotEqualTo("id", entity.getId());
        }
        int telCount = mapper.selectCountByExample(example);
        if (telCount > 0) throw new BuzzException("手机号重复");

        // 校验用户名是否重复
        Example example1 = new Example(User.class);
        Example.Criteria criteria1 = example1.createCriteria()
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("username", entity.getUsername());
        if (entity.getId() != null) {
            criteria1.andNotEqualTo("id", entity.getId());
        }
        int count1 = mapper.selectCountByExample(example);
        if (count1 > 0) throw new BuzzException("账户重复");
    }

    @Override
    public void insertSelective(User entity) {
        this.checkBeanValid(entity);

        // 初始化密码888888
        String password = new BCryptPasswordEncoder(UserConstant.PW_ENCORDER_SALT).encode("888888");
        entity.setPassword(password);
        entity.setDelState(BaseDelEntity.DEL_STATE.AVAILABLE);
        super.insertSelective(entity);

        // 关联角色
        groupUserBiz.changeUserGroup(entity.getId(), entity.getGroupIds());
    }

    @Override
    public void updateSelectiveById(User entity) {
        User beanDB = mapper.selectByPrimaryKey(entity.getId());
        if (beanDB == null) throw new NoDataException();

        this.checkBeanValid(entity);

        // 修改用户，不能修改用户密码
        entity.setPassword(beanDB.getPassword());
        entity.setDelState(BaseDelEntity.DEL_STATE.AVAILABLE);
        super.updateSelectiveById(entity);

        // 关联角色
        groupUserBiz.changeUserGroup(entity.getId(), entity.getGroupIds());

        cacheAPI.removeByPre("user:" + entity.getId());
    }

    @Override
//    @CacheClear(pre = "user{1}")
    public void deleteById(Object id) {
        User beanDB = mapper.selectByPrimaryKey(id);
        if (beanDB == null) throw new NoDataException();

        // 不能删除自身账户和admin账户
        if (ObjectUtil.equal(beanDB.getId(), "1") || ObjectUtil.equal(beanDB.getId(), getCurrentUserId())) {
            throw new BuzzException("不能删除自身账户");
        }
        super.logicDeleteById(id);
    }


    /**
     * 根据用户名获取用户信息 FIX-ME: 用户名不一定唯一，感觉换成ID会更好
     *
     * @param username 用户名
     */
//    @Cache(key = "user{1}")
    public User getUserByUsername(String username) {
        User user = new User();
        user.setUsername(username);
        user.setDelState(BaseDelEntity.DEL_STATE.AVAILABLE);
        return mapper.selectOne(user);
    }

    public User getUserByMobilePhone(String mobilePhone) {
        User user = new User();
        user.setMobilePhone(mobilePhone);
        user.setDelState(BaseDelEntity.DEL_STATE.AVAILABLE);
        return mapper.selectOne(user);
    }

//    @Cache(key = "user{1}")
    public User getUserById(String id) {
        return mapper.selectByPrimaryKey(id);
    }

    public User findByApiToken(String token) {
        if (StringUtils.isEmpty(token)) throw new BuzzException("token为空");

        Example example = new Example(User.class);
        example.createCriteria()
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("apiToken", token);
        return mapper.selectOneByExample(example);
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
        // 查询时，只查询有效的业务实体
//        query.put("delState", BaseDelEntity.DEL_STATE.AVAILABLE);
        TableResultResponse<User> userTable = super.selectPageByQuery(query);

        List<User> list = new ArrayList<>();
        userTable.getData().getRows().forEach(user -> {
            UserWeb userWeb = new UserWeb();
            BeanUtil.copyProperties(user, userWeb);

            // 获取部门信息
            Department department = departmentBiz.selectById(user.getDepartmentId());
            if (department != null) {
                userWeb.setDepartmentName(department.getName());
            }

            userWeb.setPassword(null);

            list.add(userWeb);
        });
        userTable.getData().setRows(list);

        // 枚举值
        userTable.getData().addDict("status", dictBiz.getByCode(DictConstants.CommonUserStatus.DICT_LABEL));
        userTable.getData().addDict("sex", dictBiz.getByCode(DictConstants.CommonSex.DICT_LABEL));

        return userTable;
    }

    @Override
    public List<User> selectByQuery(Query query) {
        return super.selectByQuery(query).stream().map(item -> {
            item.setPassword(null);
            return item;
        }).collect(Collectors.toList());
    }

    public ObjectRestResponse resetPwd(Map<String, Object> params) {
        Integer id = (Integer) params.get("id");
        String newPwd = (String) params.get("newPwd");

        User beanDB = mapper.selectByPrimaryKey(id);
        if (beanDB == null) throw new NoDataException();

        String password = new BCryptPasswordEncoder(UserConstant.PW_ENCORDER_SALT).encode(newPwd);
        beanDB.setPassword(password);
        super.updateSelectiveById(beanDB);

        return new ObjectRestResponse().rel(true);
    }

//    @CacheClear(pre = "user{1}")
    public void accountBaseUpdate(String userId, UserAccountVo vo) {
        // 插入时校验手机号是否重复
        Example example = new Example(User.class);
        example.createCriteria()
                .andEqualTo("mobilePhone", vo.getMobilePhone())
                .andNotEqualTo("id", userId);
        int telCount = mapper.selectCountByExample(example);
        if (telCount > 0) throw new BuzzException("手机号重复");

        // 校验用户名是否重复
        Example example1 = new Example(User.class);
        example1.createCriteria()
                .andEqualTo("username", vo.getUsername())
                .andNotEqualTo("id", userId);
        int count1 = mapper.selectCountByExample(example1);
        if (count1 > 0) throw new BuzzException("账户重复");

        User user = mapper.selectByPrimaryKey(userId);
        BeanUtils.copyProperties(vo, user);
        super.updateSelectiveById(user);
    }

//    @CacheClear(pre = "user{1}")
    public void accountBaseUpdatePwd(String userId, Map<String, Object> params) {
        String oldPwd = (String) params.get("oldPwd");
        String newPwd = (String) params.get("newPwd");

        if (oldPwd.equals(newPwd)) throw new BuzzException("新旧密码不能一样");

        User user = mapper.selectByPrimaryKey(userId);

        permissionBiz.validateCurrentUserPwd(oldPwd);

        String password = new BCryptPasswordEncoder(UserConstant.PW_ENCORDER_SALT).encode(newPwd);
        user.setPassword(password);
        super.updateSelectiveById(user);
    }

//    @CacheClear(pre = "user{1}")
    public void accountBaseUpdateApiToken(String userId) {
        User user = mapper.selectByPrimaryKey(userId);
        user.setApiToken(UUID.fastUUID().toString(true));
        super.updateSelectiveById(user);
    }

    public void accountAdminUpdatePwd(Map<String, Object> params) {
        String newPwd = (String) params.get("newPwd");
        String passwordCheck = (String) params.get("passwordCheck");
        List<Integer> ids = (List<Integer>) params.get("ids");

        permissionBiz.validateCurrentUserPwd(passwordCheck);

        if (StringUtils.isEmpty(newPwd)) {
            throw new BuzzException("新密码不能为空");
        }

        if (newPwd.trim().length() < 6 || newPwd.trim().length() > 32) {
            throw new BuzzException("新密码长度错误");
        }

        String password = new BCryptPasswordEncoder(UserConstant.PW_ENCORDER_SALT).encode(newPwd.trim());
        ids.forEach(id -> {
            User user = mapper.selectByPrimaryKey(id);
            user.setPassword(password);
            super.updateSelectiveById(user);

            cacheAPI.removeByPre("user:" + id);
        });
    }

    public void accountAdminDelete(Map<String, Object> params) {
        String passwordCheck = (String) params.get("passwordCheck");
        List<Integer> ids = (List<Integer>) params.get("ids");

        permissionBiz.validateCurrentUserPwd(passwordCheck);

        ids.forEach(id -> {
            this.deleteById(id);
            cacheAPI.removeByPre("user:" + id);
        });
    }

    public UserInfo findUserInfoById(String id) {
        if (id == null) return null;
        User user = mapper.selectByPrimaryKey(id);
        if (user == null) return null;
        UserInfo userInfo = new UserInfo();
        BeanUtil.copyProperties(user, userInfo);
        return userInfo;
    }

}
