package com.faber.api.base.admin.biz;

import com.faber.core.vo.socket.SocketTaskHolder;
import org.springframework.stereotype.Service;


@Service
public class SocketTaskBiz {

    public void stop(String taskId) {
        SocketTaskHolder.stopTask(taskId);
    }

}
