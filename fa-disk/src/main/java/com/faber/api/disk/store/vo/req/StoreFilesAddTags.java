package com.faber.api.disk.store.vo.req;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreFilesAddTags implements Serializable {

    private List<Integer> fileIds;
    private List<Integer> tagIds;

}
