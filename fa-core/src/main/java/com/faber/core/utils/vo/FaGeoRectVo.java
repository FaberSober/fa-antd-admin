package com.faber.core.utils.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaGeoRectVo implements Serializable {

    private double minLat;
    private double maxLat;
    private double minLng;
    private double maxLng;

}
