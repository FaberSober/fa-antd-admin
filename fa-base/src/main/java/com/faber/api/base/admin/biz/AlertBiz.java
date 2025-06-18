package com.faber.api.base.admin.biz;

import org.springframework.stereotype.Service;

import com.faber.api.base.admin.entity.Alert;
import com.faber.api.base.admin.mapper.AlertMapper;
import com.faber.core.web.biz.BaseBiz;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * BASE-告警信息
 *
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2023-12-16 11:40:20
 */
@Service
public class AlertBiz extends BaseBiz<AlertMapper,Alert> {

    public Map<String,Integer> selectCountOfType(){
        Map<String,Integer> res = new HashMap<>();
        Map<String, List<Alert>> groupedAlerts = list().stream()
            .collect(java.util.stream.Collectors.groupingBy(Alert::getType));
        groupedAlerts.forEach((type, alerts) -> res.put(type, alerts.size()));

        return res;
    }

}