package com.faber.core.service;

import java.util.List;

import com.faber.core.vo.utils.FaOption;

public interface FaFlowService {
    
    default List<FaOption<String>> getFlowMenuList() {
        return java.util.Collections.emptyList();
    }

}
