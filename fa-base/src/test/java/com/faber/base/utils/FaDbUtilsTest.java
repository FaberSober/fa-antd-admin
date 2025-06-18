package com.faber.base.utils;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.faber.FaTestApp;
import com.faber.api.base.rbac.biz.RbacMenuBiz;
import com.faber.api.base.rbac.entity.RbacMenu;
import com.faber.core.utils.FaDbUtils;
import com.faber.core.utils.FaExcelUtils;
import com.faber.core.vo.query.QueryParams;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;


import jakarta.annotation.Resource;
import java.util.List;
import java.util.function.Consumer;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/8 11:39
 */
@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FaDbUtilsTest {

    @Resource
    RbacMenuBiz rbacMenuBiz;

    @Test
    public void testLoopPage() {
        FaDbUtils.loopPage(
                rbacMenuBiz.lambdaQuery(),
                pageInfo -> {
                    log.debug("page: {}, isHasNextPage: {}, size: {}, pageSize: {}, total: {}", pageInfo.getPageNum(), pageInfo.isHasNextPage(), pageInfo.getSize(), pageInfo.getPageSize(), pageInfo.getTotal());
                    List<RbacMenu> list = pageInfo.getList();
                    for (RbacMenu menu : list) {
                        log.debug(menu.toString());
                    }
                },
                10
        );
    }

    @Test
    public void testLoopPageToExcel() {
        String fileName = "/Users/xupengfei/tmp/testLoopPage.xlsx";

        // 这里 需要指定写用哪个class去写
        try (ExcelWriter excelWriter = EasyExcel.write(fileName, RbacMenu.class).build()) {
            // 这里注意 如果同一个sheet只要创建一次
            WriteSheet writeSheet = EasyExcel.writerSheet().build();

            // 根据数据库分页去调用写入
            FaDbUtils.loopPage(
                    rbacMenuBiz.lambdaQuery(),
                    pageInfo -> {
                        log.debug("page: {}, isHasNextPage: {}, size: {}, pageSize: {}, total: {}", pageInfo.getPageNum(), pageInfo.isHasNextPage(), pageInfo.getSize(), pageInfo.getPageSize(), pageInfo.getTotal());
                        List<RbacMenu> list = pageInfo.getList();
                        excelWriter.write(list, writeSheet);
                    },
                    10
            );
        }
    }

    @Test
    public void testLoopPageToExcel2() {
        String fileName = "/Users/xupengfei/tmp/testLoopPage.xlsx";

        FaExcelUtils.writeExcelPage(fileName, RbacMenu.class, rbacMenuBiz.lambdaQuery(), i -> i);
    }

    @Test
    public void testBaseBizListPage() {
        List<RbacMenu> list = rbacMenuBiz.list(new QueryParams());
        for (RbacMenu menu : list) {
            log.debug(menu.toString());
        }
    }

}
