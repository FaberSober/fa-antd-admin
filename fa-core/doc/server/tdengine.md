# tdengine
- [官方文档](https://docs.taosdata.com/)

## 常用数据库操作
### 创建数据库
- https://docs.taosdata.com/basic/model/
```sql
CREATE DATABASE demo PRECISION 'ms' KEEP 3650 DURATION 10 BUFFER 16;
```
该 SQL 将创建一个名为 power 的数据库，各参数说明如下：
- PRECISION 'ms' ：这个数据库的时序数据使用毫秒（ms）精度的时间戳
- KEEP 3650：这个库的数据将保留 3650 天，超过 3650 天的数据将被自动删除
- DURATION 10 ：每 10 天的数据放在一个数据文件中
- BUFFER 16 ：写入使用大小为 16MB 的内存池。
- 
### 创建STable超级表
```sql
create stable if not exists equipment.equipment_info (ts timestamp,int_value Integer,str_value nchar(32)) tags (eqp_id nchar(32));
```

### 常用SQL
```sql
USE demo;

-- 获取超级表的结构信息
DESCRIBE equipment_info;

-- 创建超级表
create stable if not exists equipment_info (ts timestamp,int_value Integer,str_value nchar(32)) tags (eqp_id nchar(32));

-- 删除超级表
DROP STABLE IF EXISTS equipment_info;

-- 增加列
ALTER STABLE equipment_info ADD COLUMN int_value2 Integer;

-- 删除列
ALTER STABLE equipment_info DROP COLUMN int_value2;

-- 超级表插入数据
insert into equipment_info (tbname, ts, int_value, str_value, eqp_id)
values( "d1001", "2018-10-03 14:38:05", 1, "a", "sn10001");

-- 查询数据
SELECT * FROM equipment_info
WHERE int_value > 0
ORDER BY ts DESC
LIMIT 5;
```
