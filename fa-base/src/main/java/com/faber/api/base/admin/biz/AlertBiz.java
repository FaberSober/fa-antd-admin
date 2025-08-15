package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.Alert;
import com.faber.api.base.admin.mapper.AlertMapper;
import com.faber.core.web.biz.BaseBiz;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * BASE-告警信息
 *
 * @author renjinyi
 */
@Service
@Slf4j
public class AlertBiz extends BaseBiz<AlertMapper, Alert> {


    public Map<String, Integer> selectCountOfType() {
        Map<String, Integer> res = new HashMap<>();
        Map<String, List<Alert>> groupedAlerts = list().stream()
                .collect(java.util.stream.Collectors.groupingBy(Alert::getType));
        groupedAlerts.forEach((type, alerts) -> res.put(type, alerts.size()));

        return res;
    }
}