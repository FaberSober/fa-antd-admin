package com.faber.api.base.admin.vo.query;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class LogLoginCountByDayReqVo implements Serializable {

    private Date startDate;
    private Date endDate;

}
