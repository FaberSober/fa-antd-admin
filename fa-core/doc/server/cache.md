# Cache缓存
## 后台示例代码
路径：`faber-admin/src/main/java/com/faber/api/demo/biz/StudentBiz.java`

1. 第一次查询，没有缓存，查询后放入缓存中。第二次查询从缓存中获取；
2. 更新数据后，刷新缓存；
3. 删除数据后，删除缓存；

```java
package com.faber.api.demo.biz;

import com.alicp.jetcache.anno.CacheInvalidate;
import com.alicp.jetcache.anno.CacheUpdate;
import com.alicp.jetcache.anno.Cached;
import com.faber.api.demo.entity.Student;
import com.faber.core.web.biz.BaseBiz;
import com.faber.api.demo.mapper.StudentMapper;
import org.springframework.stereotype.Service;

import java.io.Serializable;

@Service
public class StudentBiz extends BaseBiz<StudentMapper, Student> {

    @Cached(name="studentCache:", key="#id", expire = 3600)
    @Override
    public Student getById(Serializable id) {
        return super.getById(id);
    }

    @CacheUpdate(name="studentCache:", key="#entity.id", value="#entity")
    @Override
    public boolean updateById(Student entity) {
        return super.updateById(entity);
    }

    @CacheInvalidate(name="studentCache:", key="#id")
    @Override
    public boolean removeById(Serializable id) {
        return super.removeById(id);
    }

}
```

### key使用固定字符串
> key生成使用SpEL，可以参考[Spring系列14：SpEL详解](https://blog.csdn.net/Joe192/article/details/125744579)
```java
@Cached(name="systemConfig", key="new String('')", expire = 3600)
```

## server命名规则整理
| key | 说明 |
| :--- | :--- |
| user:{userId} | 用户ID信息缓存 |
| rbac:userMenus:{userId} | 用户ID菜单列表 |

## 命名规范
1. 建议全部大写，不强制
2. key不能太长也不能太短，太短可读性太差，键名越长越占资源（毕竟内存很贵 按需申请）
3. key 单词与单词之间以分号":"分开，如{member:info:userabc}
4. redis使用的时候注意命名空间，一个项目一个命名空间，项目内业务不同命名空间也不同

一般情况下：
1) 第一段放置业务标识名或其缩写 如"member"
2) 第二段放信息标识 如, info/benefit/order:
3) 第三段放置用于区分区key的字段，如userId、priductId、activityId

eg：常见的设置登录token
key： PRO:USER:LOGINNAME:373166324
value：12kd-dsj5ce-d4445-h4sd472

## 参考资料
1. Spring系列14：SpEL详解: https://blog.csdn.net/Joe192/article/details/125744579

# Redis
## jetcache
参考：`com.faber.api.base.demo.biz.RedisTestBiz`
