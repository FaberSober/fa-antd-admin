
package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.SystemBiz;
import com.faber.api.base.admin.vo.ret.ServerInfo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;

@FaLogBiz("系统")
@RestController
@RequestMapping("/api/base/admin/system")
public class SystemController extends BaseResHandler {

    @Resource
    private SystemBiz systemBiz;

    @FaLogOpr("服务器信息")
    @RequestMapping(value = "/server", method = RequestMethod.GET)
    public Ret<ServerInfo> server() {
        ServerInfo data = systemBiz.server();
        return ok(data);
    }

}
