package com.faber.config.websocket.service;

import cn.hutool.json.JSONObject;
import com.faber.api.base.admin.biz.LogApiBiz;
import com.faber.config.websocket.WsBaseService;
import com.faber.config.websocket.WsClientInfoEntity;
import com.faber.config.websocket.WsHolder;
import com.faber.core.annotation.FaWsService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@FaWsService(type = "log-tail")
public class LogTailService implements WsBaseService {

    @Resource
    private LogApiBiz logApiBiz;

    // key: token, value: filePath
    private final Map<String, String> tailMap = new ConcurrentHashMap<>();
    // key: token, value: last position
    private final Map<String, Long> posMap = new ConcurrentHashMap<>();

    @Override
    public void onMessage(WsClientInfoEntity entity, JSONObject msg) {
        String action = msg.getStr("action");
        String filePath = msg.getStr("filePath");

        if ("start".equals(action)) {
            File file = new File("./log", filePath);
            if (file.exists() && file.isFile()) {
                tailMap.put(entity.getToken(), filePath);
                posMap.put(entity.getToken(), file.length());
                log.info("Start tailing log: {} for user: {}", filePath, entity.getUser().getUsername());
            }
        } else if ("stop".equals(action)) {
            tailMap.remove(entity.getToken());
            posMap.remove(entity.getToken());
            log.info("Stop tailing log for user: {}", entity.getUser().getUsername());
        }
    }

    @Scheduled(fixedDelay = 1000)
    public void tailLogs() {
        if (tailMap.isEmpty()) return;

        tailMap.forEach((token, filePath) -> {
            File file = new File("./log", filePath);
            if (!file.exists() || !file.isFile()) return;

            long lastPos = posMap.getOrDefault(token, 0L);
            long length = file.length();

            if (length > lastPos) {
                try (RandomAccessFile raf = new RandomAccessFile(file, "r")) {
                    raf.seek(lastPos);
                    String line;
                    while ((line = raf.readLine()) != null) {
                        // raf.readLine() uses ISO-8859-1, convert to UTF-8
                        line = new String(line.getBytes("ISO-8859-1"), "UTF-8");
                        WsHolder.sendMessageToToken(token, "log-tail", filePath, line);
                    }
                    posMap.put(token, raf.getFilePointer());
                } catch (IOException e) {
                    log.error("Error tailing log file: " + filePath, e);
                }
            } else if (length < lastPos) {
                // File truncated
                posMap.put(token, length);
            }
        });
    }
}
