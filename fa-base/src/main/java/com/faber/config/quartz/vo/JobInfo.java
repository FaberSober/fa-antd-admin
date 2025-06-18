package com.faber.config.quartz.vo;


/**
 * 定时任务模版Bean需要实现的接口
 * @author xupengfei
 * @date 2022/11/28 13:45
 */
public interface JobInfo {

    Integer getId();
    
    String getClazzPath();

    String getCron();
}
