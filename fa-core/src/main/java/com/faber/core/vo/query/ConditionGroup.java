package com.faber.core.vo.query;

import com.faber.core.vo.query.enums.ConditionGroupTypeEnum;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ConditionGroup implements Serializable {

    private String id;
    private ConditionGroupTypeEnum type;
    private List<Condition> condList;

}
