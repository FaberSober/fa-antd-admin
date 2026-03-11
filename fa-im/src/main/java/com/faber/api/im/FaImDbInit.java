package com.faber.api.im;

import com.faber.core.config.dbinit.DbInit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FaImDbInit implements DbInit {

    @Override
    public String getNo() {
        return "fa-im";
    }

    @Override
    public String getName() {
        return "通讯模块";
    }

}
