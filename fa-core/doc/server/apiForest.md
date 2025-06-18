# 使用Forest调用API
[forest官网](https://forest.dtflyx.com/)

## 示例

### GET
```java
public interface IpService {
    //    @Cached(name="ipAddr:", key="#ip", expire = 24 * 60 * 60)
    @Get("https://whois.pconline.com.cn/ipJson.jsp?ip={0}&json=true")
    IpAddr ipJson(String ip);
}
```

### POST
```java
import cn.hutool.json.JSONObject;
import com.dtflys.forest.annotation.*;

import java.io.File;
import java.util.List;

@Address(basePath = "#{ai.ragflow.api}/api/v1/")
@Headers({"Authorization: Bearer #{ai.ragflow.token}"})
public interface AiRagFlowService {
    @Post("datasets")
    JSONObject datasetsCreate(@JSONBody("name") String name,
                              @JSONBody("language") String language);

    /**
     * 上传文件
     */
    @Post("datasets/{dataset_id}/documents")
    JSONObject documentUpload(@Var("dataset_id") String datasetId, @DataFile("file") File file);

    @Post(url = "http://localhost:8080/hello/user")
    String helloUser(@JSONBody Map<String, Object> user);
}
```
