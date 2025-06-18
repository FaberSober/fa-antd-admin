package com.faber.api.base.demo.rest;

import com.faber.api.base.demo.biz.WebSocketTaskTestBiz;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import com.faber.core.vo.socket.SocketTaskStopVo;
import com.faber.core.vo.socket.SocketTaskVo;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

@FaLogBiz("Redis测试")
@RestController
@RequestMapping("/api/base/demo/webSocketTaskTest")
public class WebSocketTaskTestController extends BaseResHandler {

    @Resource
    WebSocketTaskTestBiz webSocketTaskTestBiz;

    @FaLogOpr("开启任务")
    @RequestMapping(value = "/start", method = RequestMethod.GET)
    @ResponseBody
    public Ret<SocketTaskVo> start() {
        SocketTaskVo data = webSocketTaskTestBiz.start();
        return ok(data);
    }

    @FaLogOpr("停止任务")
    @RequestMapping(value = "/stop", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> stop(@RequestBody SocketTaskStopVo socketTaskStopVo) {
        webSocketTaskTestBiz.stop(socketTaskStopVo.getTaskId());
        return ok();
    }

}
