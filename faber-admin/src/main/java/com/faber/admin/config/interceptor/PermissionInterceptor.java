package com.faber.admin.config.interceptor;

import com.faber.admin.biz.GateLogBiz;
import com.faber.admin.biz.PermissionBiz;
import com.faber.admin.biz.UserBiz;
import com.faber.admin.entity.GateLog;
import com.faber.admin.util.logs.DBLog;
import com.faber.admin.config.annotation.IgnoreUserToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * TODO 用户权限点校验
 */
@Slf4j
public class PermissionInterceptor extends AbstractInterceptor {

    private static final String GATE_WAY_PREFIX = "/api";

    @Autowired
    private UserBiz userBiz;

    @Autowired
    private PermissionBiz permissionBiz;

    @Autowired
    private GateLogBiz gateLogBiz;

    private ThreadLocal<GateLog> gateLogThreadLocal = new ThreadLocal<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 配置该注解，说明不进行用户拦截
        IgnoreUserToken annotation = super.getIgnoreUserToken(handler);
        if (annotation != null) {
            return super.preHandle(request, response, handler);
        }
        return super.preHandle(request, response, handler);

//        // TODO permission check
//        // check request uri permission
//        String requestUri = request.getRequestURI();
//        if (requestUri.startsWith(GATE_WAY_PREFIX)) {
//            requestUri = requestUri.substring(GATE_WAY_PREFIX.length());
//        }
//        log.info("[{}]{}", request.getMethod(), requestUri);
//
//        List<PermissionInfo> permissionIfs = permissionBiz.getAllPermission();
//
//        // 判断资源是否启用权限约束
//        String finalRequestUri = requestUri;
//        String method = request.getMethod();
//
//        Permission permissionAnno = super.getPermission(handler);

//        Stream<PermissionInfo> stream = permissionIfs.parallelStream().filter(new Predicate<PermissionInfo>() {
//            @Override
//            public boolean test(PermissionInfo permissionInfo) {
//                // 类、方法Permission注解
//                if (permissionAnno != null && permissionInfo.getCode().equals(permissionAnno.permission())) {
//                    return true;
//                }
//                // 正则匹配uri
//                String uri = permissionInfo.getUri();
//                if (uri.indexOf("{") > 0) {
//                    uri = uri.replaceAll("\\{\\*\\}", "[a-zA-Z\\\\d]+");
//                }
//                String regEx = "^" + uri + "$";
//                try {
//                    return (Pattern.compile(regEx).matcher(finalRequestUri).find()) && method.equals(permissionInfo.getMethod());
//                } catch (Exception e) {
//                    log.error(e.getMessage(), e);
//                }
//                return true;
//            }
//        });
//        List<PermissionInfo> result = stream.collect(Collectors.toList());
//        PermissionInfo[] permissions = permissionIfs.toArray(new PermissionInfo[]{});
        // 需要进行用户鉴权
//        if (permissions.length > 0) {
//            // 用户权限匹配
//            List<PermissionInfo> permissionInfos = permissionBiz.getPermissionById(BaseContextHandler.getUserID());
//            PermissionInfo current = null;
//            for (PermissionInfo info : permissions) {
//                boolean anyMatch = permissionInfos.parallelStream().anyMatch(new Predicate<PermissionInfo>() {
//                    @Override
//                    public boolean test(PermissionInfo permissionInfo) {
//                        return permissionInfo.getCode().equals(info.getCode());
//                    }
//                });
//                if (anyMatch) {
//                    current = info;
//                    break;
//                }
//            }
//            if (current == null) {
//                throw new UserNoPermissionException("无权访问");
//            }
//
//            User user = userBiz.getUserById(BaseContextHandler.getUserID());
//
//            if (CommonConstants.RESOURCE_TYPE_BTN.equals(current.getType())) {
//                GateLog log = new GateLog(current.getMenu(), current.getName(), current.getUri(), request.getRequestURI(), null, null, new Date(), user.getId() + "", user.getName(), ClientUtil.getClientIp(request));
//                gateLogThreadLocal.set(log);
//            }
//
//            return super.preHandle(request, response, handler);
//        }

//        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // TODO write log
//        GateLog log = gateLogThreadLocal.get();
//        if (log != null) {
//            DBLog.getInstance().setLogService(gateLogBiz).offerQueue(log);
//            gateLogThreadLocal.remove();
//        }
        super.afterCompletion(request, response, handler, ex);
    }
}
