# msg站内信
功能
1. 发布站内信
2. 发送阿里云短信

## 如何使用

### 配置文件定义消息模版
配置文件路径：`fa-admin/src/main/resources/application.yml`

```yaml
# --------------------------------------------- 短信模板-阿里云 ---------------------------------------------
aliyun:
  sms:
    regionId: cn-hangzhou
    accessKeyId: xx
    secret: xx
    signName: xx
    # 短信模板配置
    smsConfig:
      # 短信验证码
      SMS_CODE:
        smsCode: SMS_xxx
        template: "您的验证码为：${code}，该验证码5分钟内有效，请勿泄露于他人。"
        keys:
          - code
      # 采集端离线
      TJ_AGENT_OFFLINE:
        smsCode: SMS_xxx
        template: "采集端离线，离线时间${time}，请及时处理。"
        keys:
          - time
```

### 定义Msg Java Bean
```java
package com.faber.api.hzx.dm.vo.msg;

import com.faber.api.base.msg.helper.config.MsgSendConfig;
import com.faber.api.base.msg.helper.config.PropKey;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

/**
 * 采集端离线。
 */
@Data
@ToString
@PropKey(value = "TJ_AGENT_OFFLINE", smsEnable = true)
public class MsgTjAgentOffline extends MsgSendConfig {

    /**
     * 离线时间
     */
    private String time;

    @Builder
    public MsgTjAgentOffline(boolean sendAppPush, boolean sendSms, String buzzType, String buzzId, String time) {
        super(false, false, buzzType, buzzId);
        this.time = time;
    }
}
```

### 发送站内信
```java
import com.faber.api.base.msg.helper.MsgHelper;

@Resource
private MsgHelper msgHelper;

BaseContextHandler.useAdmin(); // 站内信使用admin角色发布
MsgTjAgentOffline msgVo = MsgTjAgentOffline.builder()
    .buzzId("")
    .buzzType("MsgTjAgentOffline")
    .time(DateUtil.formatDateTime(new Date()))
    .build();
msgHelper.sendSysMsg("1", new String[]{"1"}, msgVo);
```
