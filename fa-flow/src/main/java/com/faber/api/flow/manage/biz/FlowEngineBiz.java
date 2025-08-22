package com.faber.api.flow.manage.biz;

import com.aizuda.bpm.engine.FlowLongEngine;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

/**
 * @Author test
 * @Date 2025/8/22 16:46
 */
@Service
public class FlowEngineBiz {

    @Resource FlowLongEngine flowLongEngine;

    public void testGet() {
//        flowLongEngine.processService().deploy("")
    }

}
