package com.faber.api.media;

import com.faber.core.config.dbinit.DbInit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FaMediaDbInit implements DbInit {

    @Override
    public String getNo() {
        return "fa-media";
    }

    @Override
    public String getName() {
        return "媒体模块";
    }

}
