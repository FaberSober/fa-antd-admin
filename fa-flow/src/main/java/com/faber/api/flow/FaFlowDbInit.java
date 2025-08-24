package com.faber.api.flow;

import com.faber.core.config.dbinit.DbInit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FaFlowDbInit implements DbInit {

    @Override
    public String getNo() {
        return "fa-flow";
    }

    @Override
    public String getName() {
        return "流程模块";
    }

}
