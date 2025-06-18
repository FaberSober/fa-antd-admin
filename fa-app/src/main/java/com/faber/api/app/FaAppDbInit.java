package com.faber.api.app;

import com.faber.core.config.dbinit.DbInit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * @author Farando
 * @date 2023/2/18 20:12
 * @description
 */
@Slf4j
@Service
public class FaAppDbInit implements DbInit {

    @Override
    public String getNo() {
        return "fa-app";
    }

    @Override
    public String getName() {
        return "APP模块";
    }

}
