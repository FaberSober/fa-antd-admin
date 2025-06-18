package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.SocketTaskBiz;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import com.faber.core.vo.socket.SocketTaskStopVo;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;

@FaLogBiz("Redis测试")
@RestController
@RequestMapping("/api/base/admin/socketTask")
public class SocketTaskController extends BaseResHandler {

    @Resource
    SocketTaskBiz socketTaskBiz;

    @FaLogOpr("停止任务")
    @RequestMapping(value = "/stop", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> stop(@RequestBody SocketTaskStopVo socketTaskStopVo) {
        socketTaskBiz.stop(socketTaskStopVo.getTaskId());
        return ok();
    }

}
