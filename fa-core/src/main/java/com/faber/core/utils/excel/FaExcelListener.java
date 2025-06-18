package com.faber.core.utils.excel;

import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;

public abstract class FaExcelListener<T> extends AnalysisEventListener<T> {

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {

    }

}
