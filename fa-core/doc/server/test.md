# Test测试用例
# 注意
1. 子包目录下的测试`FaTestApp`的包路径需要为`com.faber`;

## 运行测试用例
```java
package com.faber.api.wp;

import com.faber.FaTestApp;
import com.faber.api.base.admin.biz.UserBiz;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

/**
 * @Author test
 * @Date 2025/6/5 15:10
 */
@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FaAppTest {

    @Resource UserBiz userBiz;

    @Test
    public void testGetUser() {
        System.out.println(userBiz.getById("1"));
    }

}
```

