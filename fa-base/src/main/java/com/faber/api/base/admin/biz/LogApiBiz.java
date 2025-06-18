package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.LogApi;
import com.faber.api.base.admin.mapper.LogApiMapper;
import com.faber.core.web.biz.BaseBiz;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * URL请求日志
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class LogApiBiz extends BaseBiz<LogApiMapper, LogApi> {

    @Resource ConfigSysBiz configSysBiz;

    public void deleteAll() {
        LogApi logApi = lambdaQuery()
                .orderByDesc(LogApi::getId)
                .last("LIMIT 1")
                .one();
        if (logApi == null) {
            return;
        }
        Long id = logApi.getId();
        deleteLessMinId(id);
    }

    public void deleteOverSize() {
        Integer logSaveMaxNum = configSysBiz.getConfig().getLogSaveMaxNum();
        if (logSaveMaxNum < 0) return;

        LogApi logApi = lambdaQuery()
                .orderByDesc(LogApi::getId)
                .last("LIMIT " + logSaveMaxNum + ", 1")
                .one();
        if (logApi == null) {
            return;
        }
        Long id = logApi.getId();
        deleteLessMinId(id);
    }

    public void deleteLessMinId(Long id) {
        int rowCount = baseMapper.deleteOverSize(id);
        while (rowCount > 0) {
            rowCount = baseMapper.deleteOverSize(id);
        }
    }

}
