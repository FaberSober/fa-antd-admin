package com.faber.api.flow.form.vo.req;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class SaveFormDataReqVo implements Serializable {
    
    private Integer formId;

    private Map<String, Object> formData;
    
    private List<SaveChildFormData> childFormDataList;

    @Data
    public static class SaveChildFormData implements Serializable {
        private String tableName;
        private List<Map<String, Object>> formDataList;
    }

}
