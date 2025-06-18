package com.faber.core.doc;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.util.ListUtils;
import com.alibaba.excel.write.metadata.WriteSheet;
import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.List;

public class ExcelTest {

    @Test
    public void testWriteExcelWithPage() {
        // 方法1: 如果写到同一个sheet
        String fileName = "/Users/xupengfei/tmp/testPage.xlsx";

        // 这里 需要指定写用哪个class去写
        try (ExcelWriter excelWriter = EasyExcel.write(fileName, DemoData.class).build()) {
            // 这里注意 如果同一个sheet只要创建一次
            WriteSheet writeSheet = EasyExcel.writerSheet("模板").build();
            // 去调用写入,这里我调用了五次，实际使用时根据数据库分页的总的页数来
            for (int i = 0; i < 5; i++) {
                // 分页去数据库查询数据 这里可以去数据库查询每一页的数据
                List<DemoData> data = data(i * 10);
                excelWriter.write(data, writeSheet);
            }
        }
    }

    private List<DemoData> data(int start) {
        List<DemoData> list = ListUtils.newArrayList();
        for (int i = 0; i < 10; i++) {
            int index = i + start;

            DemoData data = new DemoData();
            data.setString("字符串" + index);
            data.setDate(new Date());
            data.setDoubleData(0.56);
            list.add(data);
        }
        return list;
    }

}
