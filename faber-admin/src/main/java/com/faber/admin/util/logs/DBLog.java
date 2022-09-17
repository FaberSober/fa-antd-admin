package com.faber.admin.util.logs;

import cn.hutool.extra.spring.SpringUtil;
import com.faber.admin.biz.GateLogBiz;
import com.faber.admin.entity.GateLog;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * 系统日志写入
 */
@Slf4j
public class DBLog extends Thread {
    private static DBLog dblog = null;
    private static BlockingQueue<GateLog> logInfoQueue = new LinkedBlockingQueue<GateLog>(1024);

    private GateLogBiz gateLogBiz;

    public static synchronized DBLog getInstance() {
        if (dblog == null) {
            dblog = new DBLog();
            dblog.gateLogBiz = SpringUtil.getBean(GateLogBiz.class);
        }
        return dblog;
    }

    private DBLog() {
        super("DBLog.WriterThread");
    }

    public void offerQueue(GateLog logInfo) {
        try {
            logInfoQueue.offer(logInfo);
        } catch (Exception e) {
            log.error("日志写入失败", e);
        }
    }

    @Override
    public void run() {
        List<GateLog> bufferedLogList = new ArrayList<GateLog>(); // 缓冲队列
        while (true) {
            try {
                bufferedLogList.add(logInfoQueue.take());
                logInfoQueue.drainTo(bufferedLogList);
                if (bufferedLogList != null && bufferedLogList.size() > 0) {
                    // 写入日志
                    for (GateLog log : bufferedLogList) {
                        gateLogBiz.save(log);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                // 防止缓冲队列填充数据出现异常时不断刷屏
                try {
                    Thread.sleep(1000);
                } catch (Exception eee) {
                }
            } finally {
                if (bufferedLogList != null && bufferedLogList.size() > 0) {
                    try {
                        bufferedLogList.clear();
                    } catch (Exception e) {
                    }
                }
            }
        }
    }
}