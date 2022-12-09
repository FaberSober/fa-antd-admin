package com.faber.api.base.admin.biz;

import cn.hutool.system.oshi.OshiUtil;
import com.faber.api.base.admin.vo.ret.ServerInfo;
import org.springframework.stereotype.Service;

@Service
public class SystemBiz {

    public ServerInfo server() {
        ServerInfo serverInfo = new ServerInfo();

        serverInfo.setCpuInfo(OshiUtil.getCpuInfo());
        serverInfo.setSystem(OshiUtil.getSystem());
        serverInfo.setMemory(OshiUtil.getMemory());

        return serverInfo;
    }

}
