package com.faber.admin.biz;

import com.faber.admin.entity.Element;
import com.faber.admin.entity.Menu;
import com.faber.admin.entity.User;
import com.faber.admin.util.user.UserCheckUtil;
import com.faber.admin.vo.FrontUser;
import com.faber.admin.vo.PermissionInfo;
import com.faber.admin.vo.UserInfo;
import com.faber.common.constant.CommonConstants;
import com.faber.common.context.BaseContextHandler;
import com.faber.common.exception.auth.UserInvalidException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Created by ace on 2017/9/12.
 */
@Service
public class PermissionBiz {

    @Resource
    private UserBiz userBiz;

    @Resource
    private MenuBiz menuBiz;

    @Resource
    private ElementBiz elementBiz;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public UserInfo getUserById(String id) {
        UserInfo info = new UserInfo();
        User user = userBiz.getUserById(id);
        BeanUtils.copyProperties(user, info);
        info.setId(user.getId());
        return info;
    }

    public void validateCurrentUserPwd(String password) {
        User user = userBiz.getUserByUsername(BaseContextHandler.getUsername());
        UserCheckUtil.checkUserValid(user);
        if (encoder.matches(password, user.getPassword())) {
            return;
        }
        throw new UserInvalidException("密码验证失败");
    }

    /**
     * 登录账户
     * @param account
     * @param password
     * @return
     */
    public UserInfo validate(String account, String password) {
        UserInfo info = new UserInfo();
        User user = userBiz.getUserByUsername(account);
        if (user == null) {
            user = userBiz.getUserByMobilePhone(account);
        }
        UserCheckUtil.checkUserValid(user);
        if (encoder.matches(password, user.getPassword())) {
            BeanUtils.copyProperties(user, info);
            info.setId(user.getId());
        }
        return info;
    }

    public List<PermissionInfo> getAllPermission() {
        List<Menu> menus = menuBiz.list();
        List<PermissionInfo> result = new ArrayList<PermissionInfo>();
        PermissionInfo info = null;
        menu2permission(menus, result);
        List<Element> elements = elementBiz.getAllElementPermissions();
        element2permission(result, elements);
        return result;
    }

    private void menu2permission(List<Menu> menus, List<PermissionInfo> result) {
        PermissionInfo info;
        for (Menu menu : menus) {
            if (StringUtils.isBlank(menu.getHref())) {
                menu.setHref("/" + menu.getCode());
            }
            info = new PermissionInfo();
            info.setId(menu.getId());
            info.setCode(menu.getCode());
            info.setType(CommonConstants.RESOURCE_TYPE_MENU);
            info.setName(CommonConstants.RESOURCE_ACTION_VISIT);
            String uri = menu.getHref();
            if (StringUtils.isNotEmpty(uri) && !uri.startsWith("/")) {
                uri = "/" + uri;
            }
            info.setUri(uri);
            info.setMethod(CommonConstants.RESOURCE_REQUEST_METHOD_GET);
            result.add(info
            );
            info.setMenu(menu.getTitle());
        }
    }

//    @Cache(key = "permission:biz:getPermissionById:u{1}")
    public List<PermissionInfo> getPermissionById(String id) {
        User user = userBiz.getUserById(id);
        List<Menu> menus = menuBiz.getUserAuthorityMenuByUserId(user.getId());
        List<PermissionInfo> result = new ArrayList<PermissionInfo>();
        PermissionInfo info = null;
        menu2permission(menus, result);
        List<Element> elements = elementBiz.getAuthorityElementByUserId(user.getId() + "");
        element2permission(result, elements);
        return result;
    }

    private void element2permission(List<PermissionInfo> result, List<Element> elements) {
        PermissionInfo info;
        for (Element element : elements) {
            info = new PermissionInfo();
            info.setId(element.getId());
            info.setCode(element.getCode());
            info.setType(element.getType());
            info.setUri(element.getUri());
            info.setMethod(element.getMethod());
            info.setName(element.getName());
            info.setMenu(element.getMenuId());
            result.add(info);
        }
    }


    /**
     * 根据token获取{@link FrontUser}前端用户信息
     */
    public FrontUser getUserInfo() throws Exception {
        String id = BaseContextHandler.getUserID();
        if (id == null) {
            return null;
        }
        UserInfo user = this.getUserById(id);
        if (user == null) throw new UserInvalidException();
        FrontUser frontUser = new FrontUser();
        BeanUtils.copyProperties(user, frontUser);
        List<PermissionInfo> permissionInfos = this.getPermissionById(id);
        Stream<PermissionInfo> menus = permissionInfos.parallelStream().filter((permission) -> {
            return permission.getType().equals(CommonConstants.RESOURCE_TYPE_MENU);
        });
        frontUser.setMenus(menus.collect(Collectors.toList()));
        Stream<PermissionInfo> elements = permissionInfos.parallelStream().filter((permission) -> {
            return !permission.getType().equals(CommonConstants.RESOURCE_TYPE_MENU);
        });
        frontUser.setElements(elements.collect(Collectors.toList()));
        return frontUser;
    }

}
