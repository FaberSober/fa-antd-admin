package com.faber.disk.store;

import com.faber.AdminBootstrap;
import com.faber.api.disk.store.biz.StoreFileBiz;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class StoreFileTest {

    @Resource
    StoreFileBiz storeFileBiz;

    @Test
    public void testSyncDir() {
        storeFileBiz.syncDir(0);
    }

}
