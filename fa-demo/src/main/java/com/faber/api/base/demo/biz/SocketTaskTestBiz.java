package com.faber.api.base.demo.biz;

import cn.hutool.core.lang.UUID;
//import com.faber.api.base.admin.socket.SocketTaskImpl;
import com.faber.core.vo.socket.SocketTaskHolder;
import com.faber.core.vo.socket.SocketTaskVo;
import org.springframework.stereotype.Service;


@Service
public class SocketTaskTestBiz {

    public SocketTaskVo start() {
        SocketTaskVo socketTaskVo = new SocketTaskVo();

        // 生成唯一的任务标识
        String taskId = UUID.fastUUID().toString(true);
        socketTaskVo.setTaskId(taskId);
        socketTaskVo.setName("测试长时间进度任务");

        // 获取任务数量信息
        int total = 100;
        socketTaskVo.setTotal(total); // 假设要导入1w条数据

        // 开启新的线程，用于执行具体任务
        new Thread(() -> {
            try {
                for (int i = 0; i < total; i++) {
                    // 检查任务标志
                    if (SocketTaskHolder.isTaskStop(taskId)) {
                        SocketTaskHolder.removeTask(taskId);
                        break;
                    }

                    Thread.sleep(100); // 模拟任务导入时间花费
                    socketTaskVo.addCur();

                    // socket通知客户端任务执行进度
//                    SocketTaskImpl.sendProgress(socketTaskVo);
                }
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }).start();

        return socketTaskVo;
    }

    public void stop(String taskId) {
        SocketTaskHolder.stopTask(taskId);
    }

}
