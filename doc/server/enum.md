# 枚举
## 枚举类型定义约定
枚举类型参考如下示例类：
1. 继承IEnum；
2. enum类型的数据，在数据库中建议存储为tinyint(4)类型字段；

```java
package com.faber.core.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum BoolEnum implements IEnum<Integer> {
    NO(0, "否"),
    YES(1, "是");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    BoolEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
```
