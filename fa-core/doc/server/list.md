# list数组
## 排序
```java
docRefList.sort((v1, v2) -> v1.getDistance().compareTo(v2.getDistance()));

Collections.sort(docRefList, Comparator.comparing(AiDocumentRef::getDistance));
```