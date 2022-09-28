package com.faber.common.vo.query;

import com.faber.common.vo.query.enums.ConditionGroupTypeEnum;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ConditionGroup implements Serializable {

    private String id;
    private ConditionGroupTypeEnum type;
    private List<Condition> condList;

}
