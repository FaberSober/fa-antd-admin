package com.faber.core.utils;

import cn.hutool.core.date.DateUtil;
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.excel.read.listener.ReadListener;
import com.alibaba.excel.support.ExcelTypeEnum;
import com.alibaba.excel.write.builder.ExcelWriterBuilder;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.faber.core.annotation.FaModalName;
import com.github.pagehelper.PageInfo;
import org.apache.poi.ss.usermodel.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

public class FaExcelUtils {

    public static HttpServletResponse getResponseExcel(String filenamePrefix) throws UnsupportedEncodingException {
        HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();

        String fileName = DateUtil.format(new Date(), "yyyy_MM_dd_HH_mm_ss");
        fileName = filenamePrefix + "_" + fileName;

        response.setContentType("application/vnd.ms-excel");
        response.setCharacterEncoding("utf-8");
        fileName = URLEncoder.encode(fileName, "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
        response.setHeader("fa-filename", fileName + ".xlsx");

        return response;
    }

    /**
     * response写入下载Excel文件流
     *
     * @param clazz
     * @param list
     * @throws IOException
     */
    public static <T> void sendFileExcel(Class<T> clazz, List<T> list) throws IOException {
        HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();

        FaModalName anno = clazz.getAnnotation(FaModalName.class);

        String fileName = DateUtil.format(new Date(), "yyyy_MM_dd_HH_mm_ss");
        if (anno != null) {
            fileName = anno.name() + "_" + fileName;
        }

        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        response.setContentType("application/vnd.ms-excel");
        response.setCharacterEncoding("utf-8");
        // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
        fileName = URLEncoder.encode(fileName, "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
        response.setHeader("fa-filename", fileName + ".xlsx");

        EasyExcel
                .write(response.getOutputStream(), clazz)
                .registerWriteHandler(EasyExcelUtils.genHeaderWriteStyle())
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
//                .registerConverter(new BaseEnumConverter())
//                .registerConverter(new LocalDateTimeConverter())
                .sheet("Sheet1")
                .doWrite(list);
    }

    public static <T, E> void writeExcelPage(String fileName, Class<E> clazzExcel, LambdaQueryChainWrapper<T> wrapper, Function<? super T, ? extends E> mapper) {
        writeExcelPage(fileName, clazzExcel, wrapper, mapper, 1000);
    }

    /**
     * 分页查询数据库，然后写入Excel。
     * @param fileName excel文件路径
     * @param clazzExcel 写入Excel的Bean Class
     * @param wrapper
     * @param mapper
     * @param pageSize 分页查询每页查询数量
     * @param <T> 数据库查询Bean Class
     * @param <E> 写入Excel的Bean Class
     */
    public static <T, E> void writeExcelPage(String fileName, Class<E> clazzExcel, LambdaQueryChainWrapper<T> wrapper, Function<? super T, ? extends E> mapper, int pageSize) {
        // 这里 需要指定写用哪个class去写
        ExcelWriterBuilder builder = EasyExcel.write(fileName, clazzExcel);

        if (fileName.endsWith(".csv")) {
            builder.excelType(ExcelTypeEnum.CSV);
        }

        try (ExcelWriter excelWriter = builder.build()) {
            // 这里注意 如果同一个sheet只要创建一次
            WriteSheet writeSheet = EasyExcel.writerSheet().build();

            // 根据数据库分页去调用写入
            FaDbUtils.loopPage(
                    wrapper,
                    pageInfo -> {
                        List<T> dbList = pageInfo.getList();
                        List<E> voList = dbList.stream().map(mapper).collect(Collectors.toList());
                        excelWriter.write(voList, writeSheet);
                    },
                    pageSize
            );
        }
    }

    /**
     * 简单读取Excel内容
     * @param file
     * @param clazz
     * @param consumer
     * @param <T>
     */
    public static <T> void simpleRead(File file, Class<T> clazz, Consumer<T> consumer) {
        EasyExcel.read(file, clazz, new AnalysisEventListener<T>() {

            @Override
            public void invoke(T data, AnalysisContext context) {
                if (data == null) {
                    return;
                }
                consumer.accept(data);
            }

            @Override
            public void doAfterAllAnalysed(AnalysisContext context) {

            }
        }).sheet().doRead();
    }

    /**
     * 简单读取Excel内容
     * @param file
     * @param clazz
     * @param consumer
     * @param headRowNumber
     * @param <T>
     */
    public static <T> void simpleRead(File file, Class<T> clazz, Consumer<T> consumer, Integer headRowNumber) {
        EasyExcel.read(file, clazz, new AnalysisEventListener<T>() {

            @Override
            public void invoke(T data, AnalysisContext context) {
                consumer.accept(data);
            }

            @Override
            public void doAfterAllAnalysed(AnalysisContext context) {

            }
        }).sheet().headRowNumber(headRowNumber).doRead();
    }

    public static void simpleRead(File file, Consumer<Map<Integer, Object>> consumer) {
        EasyExcel.read(file, new ReadListener<Map<Integer, Object>>() {
            @Override
            public void invoke(Map<Integer, Object> data, AnalysisContext context) {
                consumer.accept(data);
            }

            @Override
            public void doAfterAllAnalysed(AnalysisContext context) {

            }
        }).sheet().doRead();
    }

    public static void setColor(Cell cell, short color) {
        // 根据单元格获取workbook
        Workbook workbook = cell.getSheet().getWorkbook();
        CellStyle cellStyle = workbook.createCellStyle();

        // 设置背景颜色
        cellStyle.setFillForegroundColor(color);
        cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        // 设置垂直居中为居中对齐
        cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        // 设置单元格上下左右边框为细边框
        cellStyle.setBorderBottom(BorderStyle.THIN);
        cellStyle.setBorderLeft(BorderStyle.THIN);
        cellStyle.setBorderRight(BorderStyle.THIN);
        cellStyle.setBorderTop(BorderStyle.THIN);
        //设置当前行第i列的样式
        cell.setCellStyle(cellStyle);
    }

}
