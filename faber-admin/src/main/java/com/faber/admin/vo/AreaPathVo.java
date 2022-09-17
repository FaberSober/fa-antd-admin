package com.faber.admin.vo;

import com.faber.admin.entity.Area;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.List;

@Data
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class AreaPathVo implements Serializable {
    List<Area> list;
    List<AreaTree> tree;
}
