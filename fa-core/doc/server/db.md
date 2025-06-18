# DB常见数据库操作

## 从列表里过滤出批量插入、批量更新列表
### demo1
```java
@Override
public void importExcel(CommonImportExcelReqVo reqVo) {
    File file = getFileById(reqVo.getFileId());
    Long pointId = MapUtil.getLong(reqVo, "pointId");

    SubjectWeatherPoint weatherPoint = subjectWeatherPointBiz.getByIdWithCache(pointId);
    Long factoryId = weatherPoint != null ? weatherPoint.getFactoryId() : null;

    List<WeatherRealPoint> voList = new ArrayList<>();
    FaExcelUtils.simpleRead(file, WeatherRealPoint.class, i -> {
        i.setFactoryId(factoryId);
        i.setPointId(pointId);
        voList.add(i);
    });

    if (voList == null || voList.isEmpty()) return;

    // query database by time
    List<Date> timeList = voList.stream().map(i -> i.getTime()).toList();

    List<WeatherRealPoint> dbList = lambdaQuery()
            .eq(WeatherRealPoint::getPointId, pointId)
            .in(WeatherRealPoint::getTime, timeList)
            .list();

    // 已经存在数据库的键值对
    List<String> existKeyIdList = dbList.stream().map(i -> DateUtil.formatDateTime(i.getTime())).toList();

    // 批量导入、更新
    List<WeatherRealPoint> saveList = voList.stream()
            .filter(i -> !existKeyIdList.contains(DateUtil.formatDateTime(i.getTime())))
            .toList();

    List<WeatherRealPoint> updateList = voList.stream()
            .filter(i -> existKeyIdList.contains(DateUtil.formatDateTime(i.getTime())))
            .map(i -> {
                // 查找存在数据库的数据
                WeatherRealPoint entityDB = CollUtil.findOne(dbList, f -> ObjUtil.equals(f.getTime(), i.getTime()));
                BeanUtil.copyProperties(i, entityDB, "id");
                return entityDB;
            }).toList();

    this.saveBatch(saveList);
    this.updateBatchById(updateList);
}
```

### demo2
```java
// 读取Excel中的内容
List<WeatherWeatherPointExcelInVo> voList = new ArrayList<>();
FaExcelUtils.simpleRead(nwpFile, WeatherWeatherPointExcelInVo.class, o -> {
    if (o.getTime() == null) return;
    voList.add(o);
});

// 获取更新时间范围
WeatherWeatherPointExcelInVo maxTimeVo = voList.stream().max((o1, o2) -> o1.getTime().compareTo(o2.getTime())).get();
WeatherWeatherPointExcelInVo minTimeVo = voList.stream().min((o1, o2) -> o1.getTime().compareTo(o2.getTime())).get();
List<WeatherWeatherPoint> dbPointList = lambdaQuery()
        .ge(WeatherWeatherPoint::getTime, minTimeVo.getTime())
        .le(WeatherWeatherPoint::getTime, maxTimeVo.getTime())
        .orderByAsc(WeatherWeatherPoint::getTime)
        .list();

// 已经存在数据库的键值对
List<String> existKeyIdList = dbPointList.stream().map(i -> {
    return DateUtil.formatDateTime(i.getTime());
}).collect(Collectors.toList());

// 批量导入、更新
List<WeatherWeatherPoint> saveList = voList.stream()
        .filter(i -> !existKeyIdList.contains(DateUtil.formatDateTime(i.getTime())))
        .map(i -> {
            WeatherWeatherPoint entity = new WeatherWeatherPoint();
            BeanUtil.copyProperties(i, entity);
            entity.setFactoryId(factoryId);
            entity.setPointId(weatherPointId);
            return entity;
        }).collect(Collectors.toList());

List<WeatherWeatherPoint> updateList = voList.stream()
        .filter(i -> existKeyIdList.contains(DateUtil.formatDateTime(i.getTime())))
        .map(i -> {
            // 查找存在数据库的数据
            WeatherWeatherPoint entityDB = CollUtil.findOne(dbPointList, f -> ObjUtil.equals(f.getTime(), i.getTime()));
            BeanUtil.copyProperties(i, entityDB, "id");
            return entityDB;
        }).collect(Collectors.toList());

this.saveBatch(saveList);
this.updateBatchById(updateList);
```

### 或者使用map减少CollUtil.findOne查找的次数
```java
List<WeatherWeatherPointExcelInVo> voList = new ArrayList<>();
FaExcelUtils.simpleRead(nwpFile, WeatherWeatherPointExcelInVo.class, o -> {
    if (o.getTime() == null) return;
    voList.add(o);
});

// 获取更新时间范围
WeatherWeatherPointExcelInVo maxTimeVo = voList.stream().max((o1, o2) -> o1.getTime().compareTo(o2.getTime())).get();
WeatherWeatherPointExcelInVo minTimeVo = voList.stream().min((o1, o2) -> o1.getTime().compareTo(o2.getTime())).get();
List<WeatherWeatherPoint> dbPointList = lambdaQuery()
        .ge(WeatherWeatherPoint::getTime, minTimeVo.getTime())
        .le(WeatherWeatherPoint::getTime, maxTimeVo.getTime())
        .orderByAsc(WeatherWeatherPoint::getTime)
        .list();

// 已经存在数据库的键值对
Map<String, WeatherWeatherPoint> dbMap = new HashMap<>();
predictDbList.stream().forEach(i -> {
    dbMap.put(DateUtil.formatDateTime(i.getTime()), i);
});

// 批量导入、更新
List<WeatherWeatherPoint> saveList = voList.stream()
        .filter(i -> !dbMap.containsKey(DateUtil.formatDateTime(i.getTime())))
        .map(i -> {
            WeatherWeatherPoint entity = new WeatherWeatherPoint();
            BeanUtil.copyProperties(i, entity);
            entity.setFactoryId(factoryId);
            entity.setPointId(weatherPointId);
            return entity;
        }).collect(Collectors.toList());

List<WeatherWeatherPoint> updateList = voList.stream()
        .filter(i -> dbMap.containsKey(DateUtil.formatDateTime(i.getTime())))
        .map(i -> {
            // 查找存在数据库的数据
            WeatherWeatherPoint entityDB = CollUtil.findOne(dbPointList, f -> ObjUtil.equals(f.getTime(), i.getTime()));
            BeanUtil.copyProperties(i, entityDB, "id");
            return entityDB;
        }).collect(Collectors.toList());

this.saveBatch(saveList);
this.updateBatchById(updateList);
```

## bean属性设置为null，mybatis-plus也会强制更新设置
```java
@TableField(updateStrategy = FieldStrategy.ALWAYS) // 设置字段策略为：忽略判断
private Date planProdDate;
```
