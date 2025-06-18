# java8

## stream流分组
```java
// 根据物料进行分组
Map<String, List<LinkedHashMap<String, Object>>> groupMap = list.stream().collect(Collectors.groupingBy(item -> item.get("mcode").toString()));

// 按照机器ID分组
List<SfPredictCsvVo> predictCsvVoList;
Map<Long, List<SfPredictCsvVo>> groupMap = predictCsvVoList.stream().collect(Collectors.groupingBy(i -> i.getMachine()));
// 使用lambda表达式
Map<Long, List<SfPredictCsvVo>> groupMap = predictCsvVoList.stream().collect(Collectors.groupingBy(SfPredictCsvVo::getMachine));
```

## findFirst
```java
List<String> list = Arrays.asList("Vijay", "Suresh", "Vinod");
String output = list.stream()
  .filter(e -> e.startsWith("V")) // Vijay, Vinod
  .findFirst() //Vijay
  .orElse("NA");
System.out.println(output);
```