# Reflect反射

## java中 获取泛型的Class对象
```java
public Class<T> getTClass() {
    Type type = getClass().getGenericSuperclass();
    if(!(type instanceof ParameterizedType)) {
        throw new IllegalStateException("Type must be a parameterized type");
    }
    ParameterizedType parameterizedType = (ParameterizedType)type;
    // 获取泛型的具体类型  这里是单泛型
    Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
    if(null == actualTypeArguments || actualTypeArguments.length<1) {
        throw new IllegalStateException("Number of type arguments must be 1");
    }
    return (Class<T>) actualTypeArguments[0];
}
```

## java获取list的type
```java
Type type = (new ArrayList<PdPlanTaskDownloadVo>()).getClass().getGenericSuperclass();
```
