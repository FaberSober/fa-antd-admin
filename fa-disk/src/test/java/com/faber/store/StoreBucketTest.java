package com.faber.store;


import com.faber.FaTestApp;
import com.faber.api.disk.store.biz.StoreBucketBiz;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.annotation.Resource;

@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class StoreBucketTest {

    @Resource
    StoreBucketBiz storeBucketBiz;

    @Test
    public void testSyncBucketSize() {
        storeBucketBiz.syncBucketSize();
    }

}
