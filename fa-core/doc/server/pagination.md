# 分页Pagination

## 如何写分页接口
### controller接口
代码如下：
```java
@FaLogOpr(value = "检索文件分页", crud = LogCrudEnum.R)
@LogNoRet
@RequestMapping(value = "/queryFilePage", method = RequestMethod.POST)
@ResponseBody
public TableRet<StoreFile> queryFilePage(@RequestBody BasePageQuery<StoreFileQueryVo> params) {
    return baseBiz.queryFilePage(params);
}
```

### biz业务逻辑
```java
public TableRet<StoreFile> queryFilePage(BasePageQuery<StoreFileQueryVo> query) {
    PageInfo<StoreFile> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
            .doSelectPageInfo(() -> baseMapper.queryFile(query.getQuery(), query.getSorter()));
    return new TableRet<>(info);
}
```