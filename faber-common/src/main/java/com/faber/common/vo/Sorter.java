package com.faber.common.vo;

import lombok.Data;
import lombok.ToString;
import lombok.experimental.Accessors;

@Data
@ToString
@Accessors(chain = true)
public class Sorter {

    private String field;
    private boolean isAsc;

}
