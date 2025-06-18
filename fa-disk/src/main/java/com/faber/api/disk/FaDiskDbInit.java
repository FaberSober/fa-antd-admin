package com.faber.api.disk;

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
public class FaDiskDbInit implements DbInit {

    @Override
    public String getNo() {
        return "fa-disk";
    }

    @Override
    public String getName() {
        return "网盘模块";
    }

}
