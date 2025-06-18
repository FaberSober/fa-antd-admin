# GEO地图相关

## 经纬度数据库字段定义
经纬度定义使用decimal(11,8)，可以精确到厘米级。

# 数据库计算距离
## MySQL
```sql
CREATE FUNCTION `lat_lng_distance` (lat1 FLOAT, lng1 FLOAT, lat2 FLOAT, lng2 FLOAT)
RETURNS FLOAT
DETERMINISTIC
BEGIN
    RETURN 6371 * 2 * ASIN(SQRT(
        POWER(SIN((lat1 - abs(lat2)) * pi()/180 / 2),
        2) + COS(lat1 * pi()/180 ) * COS(abs(lat2) *
        pi()/180) * POWER(SIN((lng1 - lng2) *
        pi()/180 / 2), 2) ));
END
```