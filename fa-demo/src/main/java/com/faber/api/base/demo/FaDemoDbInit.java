package com.faber.api.base.demo;

import com.faber.core.config.dbinit.DbInit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FaDemoDbInit implements DbInit {

    @Override
    public String getNo() {
        return "fa-demo";
    }

    @Override
    public String getName() {
        return "测试模块";
    }

}
