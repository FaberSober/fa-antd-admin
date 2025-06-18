package com.faber.core.service;

import com.faber.core.vo.utils.DictOption;

import java.io.Serializable;
import java.util.List;

public interface DictService {

    List<DictOption<Serializable>> getOptionsByCode(String code);

}
