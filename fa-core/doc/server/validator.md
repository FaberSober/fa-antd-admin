# validator数据校验

## demo
```java
package com.faber.api.wp.data.vo.req;

import lombok.Data;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
public class XxxReqVo implements Serializable {
    
    @NotEmpty
    private List<Integer> factoryIds; // 开始时间

    @NotNull
    private Date dateStart; // 开始时间

    @NotNull
    private Date dateEnd; // 结束时间

}

```