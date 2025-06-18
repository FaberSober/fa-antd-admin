package com.faber.api.base;

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
public class FaBaseDbInit implements DbInit {

    @Override
    public Integer getOrder() {
        return 0;
    }

    @Override
    public String getNo() {
        return "fa-base";
    }

    @Override
    public String getName() {
        return "基础模块";
    }

}
