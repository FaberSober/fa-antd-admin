package com.faber.base.utils;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.read.listener.PageReadListener;
import com.faber.api.base.rbac.entity.RbacRole;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;

@Slf4j
public class ExcelTest {

    @Test
    public void simpleRead() {
        // 写法1：JDK8+ ,不用额外写一个DemoDataListener
        // since: 3.0.0-beta1
        String fileName = "/Users/xupengfei/Downloads/role.xlsx";
        // 这里 需要指定读用哪个class去读，然后读取第一个sheet 文件流会自动关闭
        // 这里每次会读取100条数据 然后返回过来 直接调用使用数据就行
        EasyExcel.read(fileName, RbacRole.class, new PageReadListener<RbacRole>(dataList -> {
            for (RbacRole demoData : dataList) {
                log.info("读取到一条数据{}", demoData);
            }
        })).sheet().doRead();
    }

}
