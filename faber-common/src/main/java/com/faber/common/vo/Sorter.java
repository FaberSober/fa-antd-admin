package com.faber.common.vo;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class Sorter {

    private String field;
    private boolean isAsc;

}
