package com.faber.buzz.admin.rest;

import com.faber.buzz.admin.biz.SystemBiz;
import com.faber.buzz.admin.vo.ServerInfo;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/admin/system")
@Slf4j
public class SystemController extends BaseResHandler {

    @Resource
    private SystemBiz systemBiz;

    /**
     * 获取服务器信息
     *
     * @return
     */
    @RequestMapping(value = "/server", method = RequestMethod.GET)
    public Ret<ServerInfo> server() {
        ServerInfo data = systemBiz.server();
        return ok(data);
    }

}
