package com.faber.common.util;

import cn.hutool.core.io.FileUtil;
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.write.metadata.style.WriteCellStyle;
import com.alibaba.excel.write.metadata.style.WriteFont;
import com.alibaba.excel.write.style.HorizontalCellStyleStrategy;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Slf4j
public class EasyExcelUtils {

    /**
     * 拦截器形式自定义样式
     * @return
     */
    public static HorizontalCellStyleStrategy genHeaderWriteStyle() {
        // 头的策略
        WriteCellStyle headWriteCellStyle = new WriteCellStyle();
        // 背景设置为红色
        headWriteCellStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
        WriteFont headWriteFont = new WriteFont();
        headWriteFont.setFontHeightInPoints((short) 11);
        headWriteCellStyle.setWriteFont(headWriteFont);
        // 内容的策略
        WriteCellStyle contentWriteCellStyle = new WriteCellStyle();
        // 这里需要指定 FillPatternType 为FillPatternType.SOLID_FOREGROUND 不然无法显示背景颜色.头默认了 FillPatternType所以可以不指定
//        contentWriteCellStyle.setFillPatternType(FillPatternType.SOLID_FOREGROUND);
//        // 背景绿色
//        contentWriteCellStyle.setFillForegroundColor(IndexedColors.GREEN.getIndex());
//        WriteFont contentWriteFont = new WriteFont();
//        // 字体大小
//        contentWriteFont.setFontHeightInPoints((short) 20);
//        contentWriteCellStyle.setWriteFont(contentWriteFont);
        // 这个策略是 头是头的样式 内容是内容的样式 其他的策略可以自己实现
        HorizontalCellStyleStrategy horizontalCellStyleStrategy =
                new HorizontalCellStyleStrategy(headWriteCellStyle, contentWriteCellStyle);
        return horizontalCellStyleStrategy;
    }

    /**
     *
     * @param list
     * @param clazz
     * @param pathDir /account/upload/fail/
     * @return /static/account/upload/fail/${filename}.xlsx
     * @throws IOException
     */
    public static String writeListToFile(List list, Class clazz, String pathDir) throws IOException {
        if (list == null || list.isEmpty()) {
            return null;
        }

        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if (!path.exists()) path = new File("");
        log.info("path:" + path.getAbsolutePath());

        // 拷贝模板文件
        String filePath = pathDir + System.currentTimeMillis() + ".xlsx";
        File saveFile = new File(path.getAbsolutePath(), "/static" + filePath);
        FileUtil.mkParentDirs(saveFile);
        EasyExcel.write(saveFile, clazz).registerWriteHandler(EasyExcelUtils.genHeaderWriteStyle()).sheet(0).doWrite(list);
        return filePath;
    }

}
