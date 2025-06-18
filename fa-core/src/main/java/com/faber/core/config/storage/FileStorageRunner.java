package com.faber.core.config.storage;

import com.faber.core.service.StorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

/**
 * 启动执行器：应用启动后，扫描数据库中存储的配置，使用spring-file-storage进行动态配置
 *
 * @author xu.pengfei
 * @create 2023/01/13
 */
@Order(value = 11)
@Slf4j
@Configuration
public class FileStorageRunner implements CommandLineRunner {

    @Autowired
    private StorageService storageService;

    @Override
    public void run(String... args) {
        storageService.syncStorageDatabaseConfig();
    }
}
