package com.faber.api.base.generator.biz;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.io.FileUtil;
import com.faber.api.base.generator.enums.GeneratorTypeEnum;
import com.faber.api.base.generator.mapper.GeneratorMapper;
import com.faber.api.base.generator.utils.GeneratorUtils;
import com.faber.api.base.generator.vo.req.*;
import com.faber.api.base.generator.vo.ret.CodeGenRetVo;
import com.faber.api.base.generator.vo.ret.ColumnVo;
import com.faber.api.base.generator.vo.ret.TableVo;
import com.faber.core.exception.BuzzException;
import com.faber.core.utils.FaFileUtils;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.BasePageQuery;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * @author Farando
 * @date 2023/3/9 11:00
 * @description
 */
@Slf4j
@Service
public class GeneratorBiz {

    @Resource
    GeneratorMapper generatorMapper;

    public TableRet<TableVo> pageTable(BasePageQuery<TableQueryVo> query) {
        PageInfo<TableVo> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
                .doSelectPageInfo(() -> generatorMapper.queryTable(query.getQuery(), query.getSorter()));
        return new TableRet<>(info);
    }

    public CodeGenRetVo preview(CodeGenReqVo codeGenReqVo) {
        CodeGenRetVo retVo = new CodeGenRetVo();
        BeanUtil.copyProperties(codeGenReqVo, retVo);

        List<ColumnVo> columnVoList = generatorMapper.queryColumns(codeGenReqVo.getTableName());

        TableVo tableVo = generatorMapper.getTableByName(codeGenReqVo.getTableName());
        String code = GeneratorUtils.generatorCode(codeGenReqVo, tableVo, columnVoList);
        retVo.setCode(code);

        return retVo;
    }

    public void copyBatch(CodeGensReqVo codeGensReqVo) throws IOException {
        for (GeneratorTypeEnum type : codeGensReqVo.getTypes()) {
            for (String tableName: codeGensReqVo.getTableNames()) {
                CodeGenReqVo codeGenReqVo = new CodeGenReqVo();
                BeanUtil.copyProperties(codeGensReqVo, codeGenReqVo);
                codeGenReqVo.setType(type);
                codeGenReqVo.setTableName(tableName);

                copyOne(codeGenReqVo);
            }
        }
    }

    public void copyOne(CodeGenReqVo codeGenReqVo) throws IOException {
        switch (codeGenReqVo.getType()) {
            case RN_PROPS:
                throw new BuzzException("暂不支持此类型文件自动复制，请手动添加");
        }

        List<ColumnVo> columnVoList = generatorMapper.queryColumns(codeGenReqVo.getTableName());
        TableVo tableVo = generatorMapper.getTableByName(codeGenReqVo.getTableName());

        copyOneJava(codeGenReqVo, columnVoList, tableVo, codeGenReqVo.getType());
    }

    public void copyOneToPath(CodeCopyToReqVo codeCopyToReqVo) {
        List<ColumnVo> columnVoList = generatorMapper.queryColumns(codeCopyToReqVo.getTableName());
        TableVo tableVo = generatorMapper.getTableByName(codeCopyToReqVo.getTableName());

        String code = GeneratorUtils.generatorCode(codeCopyToReqVo, tableVo, columnVoList);
        String path = codeCopyToReqVo.getPath() + File.separator + GeneratorUtils.getFileName(codeCopyToReqVo);
        log.debug("---->>> {}", path);

        FileUtil.writeString(code, path, StandardCharsets.UTF_8);
    }

    public void copyAll(CodeCopyVo codeCopyVo) throws IOException {
        if (codeCopyVo.getTableNames() == null || codeCopyVo.getTableNames().isEmpty()) {
            throw new BuzzException("请选择表");
        }

        for (String tableName: codeCopyVo.getTableNames()) {
            CodeGenReqVo codeGenReqVo = new CodeGenReqVo();
            BeanUtil.copyProperties(codeCopyVo, codeGenReqVo);
            codeGenReqVo.setTableName(tableName);

            List<ColumnVo> columnVoList = generatorMapper.queryColumns(codeGenReqVo.getTableName());
            TableVo tableVo = generatorMapper.getTableByName(codeGenReqVo.getTableName());

            log.debug("----- 复制java代码 ----->>>>");
            copyOneJava(codeGenReqVo, columnVoList, tableVo, GeneratorTypeEnum.JAVA_ENTITY);
            copyOneJava(codeGenReqVo, columnVoList, tableVo, GeneratorTypeEnum.JAVA_MAPPER);
            copyOneJava(codeGenReqVo, columnVoList, tableVo, GeneratorTypeEnum.JAVA_BIZ);
            copyOneJava(codeGenReqVo, columnVoList, tableVo, GeneratorTypeEnum.JAVA_CONTROLLER);
            copyOneJava(codeGenReqVo, columnVoList, tableVo, GeneratorTypeEnum.XML_MAPPER);

            log.debug("----- 复制前端代码 ----->>>>");
            copyOneJava(codeGenReqVo, columnVoList, tableVo, GeneratorTypeEnum.RN_MODAL);
            copyOneJava(codeGenReqVo, columnVoList, tableVo, GeneratorTypeEnum.RN_LIST);
        }
    }

    public void copyOneJava(CodeGenReqVo codeGenReqVo, List<ColumnVo> columnVoList, TableVo tableVo, GeneratorTypeEnum type) throws IOException {
        codeGenReqVo.setType(type);
        String code = GeneratorUtils.generatorCode(codeGenReqVo, tableVo, columnVoList);
        String path = GeneratorUtils.getJavaCopyPath(codeGenReqVo);
        log.debug("---->>> {}", path);

        FileUtil.writeString(code, path, StandardCharsets.UTF_8);
    }

}
