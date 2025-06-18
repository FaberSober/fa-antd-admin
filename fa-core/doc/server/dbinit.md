# 数据库初始化Db Init
## 说明
1. 实现数据库初始化的方法：`com.faber.api.base.admin.biz.SystemUpdateLogBiz.initDb()`

## 定义每个版本数据库操作的SQL
1. 参考示例文件：`com.faber.api.base.demo.FaDemoDbInit`

## 新建数据库表说明
1. 主键、ID类型的column可以使用bigint(14)+自增（会比int(11)多增加一倍的存储量），这样在后端是Long类型，返回给前端是string，在前端ts文件中定义也是string。
2. 后期如果需要将主键替换为uuid时，只要把java中定义修改String、生成逻辑修改为UUID。前端仍然使用的是string类型，不需要变动。

### bigint、int、smallint、tinyint 的区别
1. bigint：从-2^63(-9223372036854775808)到2^63-1(9223372036854775807) 的整型数据（所有数字），存储大小为8个字节。
2. int：从-2^31(-2147483648)到2^31-1(2147483647)的整型数据（所有数字）。存储为4个字节。
3. smallint：从-2^15(-32768)到2^15-1(32767)的整型数据。存储大小为2个字节。
4. tinyint：从0到255的整型数据。存储大小为1个字节。

## 文件名称

### ddl类型

fa-base_1.0.0_ddl.sql

# 补充SQL
## 中国地区表导入sql下载
1. [点击下载sql文件](http://file.qiniu.test.dward.cn/fa/fa-core/sql/base_area.sql.zip)
2. 解压导入sql表即可


