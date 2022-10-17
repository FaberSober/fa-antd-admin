package com.faber.admin.rest;

import com.faber.admin.biz.SystemBiz;
import com.faber.admin.vo.ServerInfo;
import com.faber.common.utils.BaseResHandler;
import com.faber.common.vo.msg.ObjectRestResponse;
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
    public ObjectRestResponse<ServerInfo> server() {
        ServerInfo data = systemBiz.server();
        return ok(data);
    }

}
