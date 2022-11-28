package com.faber.buzz.admin.vo;

import com.faber.buzz.admin.entity.Area;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AreaPathVo implements Serializable {
    List<Area> list;
    List<AreaTree> tree;
}
