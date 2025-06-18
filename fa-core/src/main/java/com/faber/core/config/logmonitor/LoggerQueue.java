package com.faber.core.config.logmonitor;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class LoggerQueue {
    //队列大小
    public static final int QUEUE_MAX_SIZE = 1000;
    private static LoggerQueue alarmMessageQueue = new LoggerQueue();
    //阻塞队列
    private BlockingQueue blockingQueue = new LinkedBlockingQueue<>(QUEUE_MAX_SIZE);

    private LoggerQueue() {
    }

    public static LoggerQueue getInstance() {
        return alarmMessageQueue;
    }

    public int size() {
        return this.blockingQueue.size();
    }

    /**
     * @Description: 消息入队
     * @Return: boolean
     * @Author: leijun
     * @Date: 2019/11/26
     **/
    public boolean push(LoggerMessage log) {
        return this.blockingQueue.add(log);//队列满了就抛出异常，不阻塞
    }

    /**
     * @Description: 消息出队
     * @Return: com.unismc.springbootudcap.powersecurity.entity.EsLoggerMessageDocument
     * @Author: leijun
     * @Date: 2019/11/26
     **/
    public LoggerMessage poll() {
        LoggerMessage result = null;
        try {
            result = (LoggerMessage) this.blockingQueue.take();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return result;
    }
}
