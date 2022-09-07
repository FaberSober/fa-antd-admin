# 常用代码整理
## request请求隐藏message弹窗提示
```javascript
  // 在配置中加入headers: { hideErrorMsg: '1' }

  /** 获取cron最近5次运行时间 */
  quartzLatest = (cron: string, times: number): Promise<Ajax.Response<string[]>> =>
    requestPost(`${GATE_APP.admin}/${serviceModule}/quartz/latest`, { cron, times }, {
      headers: { hideErrorMsg: '1' }
    });
```