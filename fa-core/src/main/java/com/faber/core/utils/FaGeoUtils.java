package com.faber.core.utils;

import com.faber.core.utils.vo.FaGeoRectVo;

/**
 * 地理GEO相关帮助类
 */
public class FaGeoUtils {

    private static final double x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    private static final double PI = 3.1415926535897932384626;
    private static final double a = 6378245.0;
    private static final double ee = 0.00669342162296594323;

    /**
     * 根据经纬度和半径 计算
     * @param longitude 经度
     * @param latitude 纬度
     * @param radius 搜索半径 m
     * @return {@link FaGeoRectVo}
     */
    public static FaGeoRectVo lngLatCalculation(Double longitude, Double latitude, Integer radius) {
        // 赤道周长24901英里 1609是转换成米的系数
        double degree = (24901 * 1609) / 360.0;
        double radiusMile = radius;
        double dpmLat = 1 / degree;
        double radiusLat = dpmLat * radiusMile;
        double minLat = latitude - radiusLat;
        double maxLat = latitude + radiusLat;
        double mpdLng = degree * Math.cos(latitude * (Math.PI / 180));
        double dpmLng = 1 / mpdLng;
        double radiusLng = dpmLng * radiusMile;
        double minLng = longitude - radiusLng;
        double maxLng = longitude + radiusLng;

        return new FaGeoRectVo(minLat, maxLat, minLng, maxLng);
    }

    /**
     * 百度->高德/谷歌
     * @param bd_lng
     * @param bd_lat
     * @return
     */
    public static double[] bd09toGcj02(double bd_lng, double bd_lat) {
        bd_lng = +bd_lng;
        bd_lat = +bd_lat;
        double x = bd_lng - 0.0065;
        double y = bd_lat - 0.006;
        double z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
        double theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
        double gg_lng = z * Math.cos(theta);
        double gg_lat = z * Math.sin(theta);
        return new double[]{gg_lng, gg_lat};
    }

    /**
     * 高德/谷歌 -> 百度
     * @param lng
     * @param lat
     * @return
     */
    public static double[] gcj02toBd09(double lng, double lat) {
        lat = +lat;
        lng = +lng;
        double z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
        double theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
        double bd_lng = z * Math.cos(theta) + 0.0065;
        double bd_lat = z * Math.sin(theta) + 0.006;
        return new double[]{bd_lng, bd_lat};
    }

    /**
     * 84 —> 高德/谷歌
     * @param lng
     * @param lat
     * @return
     */
    public static double[] wgs84toGcj02(double lng, double lat) {
        lat = +lat;
        lng = +lng;
        if (out_of_china(lng, lat)) {
            return new double[]{lng, lat};
        } else {
            double dlat = transformlat(lng - 105.0, lat - 35.0);
            double dlng = transformlng(lng - 105.0, lat - 35.0);
            double radlat = lat / 180.0 * PI;
            double magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            double sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            double mglat = lat + dlat;
            double mglng = lng + dlng;
            return new double[]{mglng, mglat};
        }
    }

    /**
     * 高德/谷歌 -> 84
     * @param lng
     * @param lat
     * @return
     */
    public static double[] gcj02toWgs84(double lng, double lat) {
        lat = +lat;
        lng = +lng;
        if (out_of_china(lng, lat)) {
            return new double[]{lng, lat};
        } else {
            double dlat = transformlat(lng - 105.0, lat - 35.0);
            double dlng = transformlng(lng - 105.0, lat - 35.0);
            double radlat = lat / 180.0 * PI;
            double magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            double sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            double mglat = lat + dlat;
            double mglng = lng + dlng;
            return new double[]{lng * 2 - mglng, lat * 2 - mglat};
        }
    }

    private static double transformlat(double lng, double lat) {
        lat = +lat;
        lng = +lng;
        double ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    private static double transformlng(double lng, double lat) {
        lat = +lat;
        lng = +lng;
        double ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret;
    }

    private static boolean out_of_china(double lng, double lat) {
        lat = +lat;
        lng = +lng;
        // Latitude: 3.86~53.55, Longitude: 73.66~135.05
        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    }

}
