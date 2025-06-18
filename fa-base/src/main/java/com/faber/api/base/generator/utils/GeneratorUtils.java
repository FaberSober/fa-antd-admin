package com.faber.api.base.generator.utils;

import cn.hutool.core.util.StrUtil;
import com.faber.api.base.generator.vo.req.CodeGenReqVo;
import com.faber.api.base.generator.vo.ret.ColumnVo;
import com.faber.api.base.generator.vo.ret.TableVo;
import com.faber.core.exception.BuzzException;
import com.faber.core.utils.FaFileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.WordUtils;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;

import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.util.*;
import java.util.zip.ZipOutputStream;

/**
 * 代码生成器   工具类
 */
public class GeneratorUtils {

    public static String javaTypeToTsType(String javaType) {
        switch (javaType) {
            case "Integer":
            case "Float":
            case "Double":
            case "BigDecimal":
                return "number";
            case "Boolean":
                return "boolean";
            default:
                return "string";
        }
    }

    public static String mysqlTypeToJavaType(ColumnVo columnVo) {
        switch (columnVo.getColumnType()) {
            case "tinyint(1)": // tinyint(1)表示boolean
                return "Boolean";
        }

        switch (columnVo.getDataType()) {
            // ----------------------- number -----------------------
            case "tinyint":
            case "smallint":
            case "mediumint":
            case "int":
            case "integer":
                return "Integer";
            case "bigint":
                return "Long";
            case "float":
                return "Float";
            case "double":
                return "Double";
            case "decimal":
                return "BigDecimal";
            case "bit":
                return "Boolean";

            // ----------------------- string -----------------------
            case "char":
            case "varchar":
            case "tinytext":
            case "text":
            case "mediumtext":
            case "longtext":
            case "enum":
                return "String";

            // ----------------------- date -----------------------
            case "date":
            case "datetime":
            case "timestamp":
                return "Date";

            // ----------------------- date -----------------------
            case "json":
                return "Map<String, Object>";

            default:
                return "String";
        }
    }

    public static List<String> getTemplates() {
        List<String> templates = new ArrayList<String>();
//        templates.add("template/index.js.vm");
//        templates.add("template/index.vue.vm");
        // SpringBoot Java代码
        templates.add("template/mapper.xml.vm");
        templates.add("template/biz.java.vm");
        templates.add("template/entity.java.vm");
        templates.add("template/mapper.java.vm");
        templates.add("template/controller.java.vm");
        // RN 前端页面
        templates.add("template/rn_service.ts.vm");
        templates.add("template/rn_list.tsx.vm");
        templates.add("template/rn_modal.tsx.vm");
        templates.add("template/rn_prop.ts.vm");
        return templates;
    }

    /**
     * 生成代码
     */
    public static String generatorCode(CodeGenReqVo codeGenReqVo, TableVo table, List<ColumnVo> columns) {
        //表名转换成Java类名
        String className = tableToJava(table.getTableName(), codeGenReqVo.getTablePrefix());

        //列信息
        ColumnVo pkCol = null;
        String pkColAttrType = null; // pk col java type
        String pkColAttrTsType = null; // pk col ts type
        boolean hasJSON = false;
        for (ColumnVo column : columns) {
            //列名转换成Java属性名
            String attrName = columnToJava(column.getColumnName());
//            column.setAttrName(attrName);
            column.setAttrname(StringUtils.uncapitalize(attrName));

            //列的数据类型，转换成Java类型
            String attrType = mysqlTypeToJavaType(column);
            column.setAttrType(attrType);

            //列的数据类型，转换成TypeScript类型
            String attrTsType = javaTypeToTsType(attrType);
            column.setAttrTsType(attrTsType);

            //是否主键
            if ("PRI".equalsIgnoreCase(column.getColumnKey())) {
                pkCol = column;
                pkColAttrType = attrType;
                pkColAttrTsType = attrTsType;
            }

            // 是否有JSON
            if ("json".equalsIgnoreCase(column.getColumnType())) {
                hasJSON = true;
            }
        }

        //没主键，则第一个字段为主键
        if (pkCol == null) {
            pkCol = columns.get(0);
        }

        //设置velocity资源加载器
        Properties prop = new Properties();
        prop.put("file.resource.loader.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
        Velocity.init(prop);

        //封装模板数据
        Map<String, Object> map = new HashMap<>();
        map.put("tableName", table.getTableName());
        map.put("comments", table.getTableComment());
        map.put("pk", pkCol);
        map.put("pkColAttrType", pkColAttrType);
        map.put("pkColAttrTsType", pkColAttrTsType);
        map.put("className", className);
        map.put("classNameLowerCaseFirstOne", toLowerCaseFirstOne(className));
        map.put("pathName", className.toLowerCase());
        map.put("columns", columns);
        map.put("hasJSON", hasJSON);
        map.put("package", codeGenReqVo.getPackageName());
        map.put("author", codeGenReqVo.getAuthor());
        map.put("email", codeGenReqVo.getEmail());
        map.put("datetime", DateUtils.format(new Date(), DateUtils.DATE_TIME_PATTERN));
        map.put("apiPath", codeGenReqVo.getApiPath());
        map.put("apiPathDot", codeGenReqVo.getApiPath().replaceAll("/", "."));
        map.put("moduleName", codeGenReqVo.getMainModule());
        map.put("moduleNameSlash", codeGenReqVo.getMainModule().replaceAll("\\.", "/")); // 将前端模块base.admin ---> base/admin，用于controller的路径中
        map.put("moduleNameUpperCaseFirstOne", toUpperCaseFirstOne(StrUtil.toCamelCase(codeGenReqVo.getMainModule(), '.')));
        map.put("secondModuleName", toLowerCaseFirstOne(className));
        VelocityContext context = new VelocityContext(map);

        //渲染模板
        String template = "template/" + codeGenReqVo.getType().getDesc();
        StringWriter sw = new StringWriter();
        Template tpl = Velocity.getTemplate(template, "UTF-8");
        tpl.merge(context, sw);
        return sw.toString();
    }


    /**
     * 列名转换成Java属性名
     */
    public static String columnToJava(String columnName) {
        return WordUtils.capitalizeFully(columnName, new char[]{'_'}).replace("_", "");
    }

    /**
     * 表名转换成Java类名
     */
    public static String tableToJava(String tableName, String tablePrefix) {
        if (StringUtils.isNotBlank(tablePrefix)) {
            tableName = tableName.replace(tablePrefix, "");
        }
        return columnToJava(tableName);
    }

    /**
     * 解析rn前端的模块目录，返回frontend\apps\admin\features\fa-admin-pages，即pages前面的路径
     * @param rnCopyPath 输入：frontend\apps\admin\features\fa-admin-pages\pages\admin\system\tenant
     * @return
     */
    public static String getRnRootPath(String rnCopyPath) {
        if (!rnCopyPath.contains("\\pages\\")) throw new BuzzException("路径需要包含pages");
        return rnCopyPath.substring(0, rnCopyPath.indexOf("\\pages\\"));
    }

    public static String getFileName(CodeGenReqVo codeGenReqVo) {
        String className = tableToJava(codeGenReqVo.getTableName(), codeGenReqVo.getTablePrefix());
        String classname = toLowerCaseFirstOne(className);

        switch (codeGenReqVo.getType()) {
            case JAVA_ENTITY:
                return className + ".java";
            case JAVA_MAPPER:
                return className + "Mapper.java";
            case JAVA_BIZ:
                return className + "Biz.java";
            case JAVA_CONTROLLER:
                return className + "Controller.java";
            case XML_MAPPER:
                return className + "Mapper.xml";

            case RN_MODAL:
                return className + "Modal.tsx";
            case RN_VIEW:
                return className + "View.tsx";
            case RN_LIST:
                return className + "List.tsx";
            case RN_SERVICE:
                return classname + ".ts";
            case RN_PROPS:
                return classname + ".ts";
        }
        return "";
    }

    public static String getJavaCopyPath(CodeGenReqVo codeGenReqVo) throws IOException {
        String rootDir = FaFileUtils.getProjectRootDir();

        String packagePath = "src" + File.separator + "main" + File.separator + "java" + File.separator;

        if (StringUtils.isNotBlank(codeGenReqVo.getPackageName())) {
            packagePath += codeGenReqVo.getPackageName().replace(".", File.separator) + File.separator;
        }

        String className = tableToJava(codeGenReqVo.getTableName(), codeGenReqVo.getTablePrefix());
        String classname = toLowerCaseFirstOne(className);
        String javaPath = rootDir + File.separator + codeGenReqVo.getJavaCopyPath() + File.separator + packagePath;
        String resourcePath = rootDir + File.separator + codeGenReqVo.getJavaCopyPath() + File.separator + "src" + File.separator + "main" + File.separator + "resources" + File.separator;
        String rnRootPath = getRnRootPath(codeGenReqVo.getRnCopyPath());
        switch (codeGenReqVo.getType()) {
            case JAVA_ENTITY:
                return javaPath + "entity" + File.separator + className + ".java";
            case JAVA_MAPPER:
                return javaPath + "mapper" + File.separator + className + "Mapper.java";
            case JAVA_BIZ:
                return javaPath + "biz" + File.separator + className + "Biz.java";
            case JAVA_CONTROLLER:
                return javaPath + "rest" + File.separator + className + "Controller.java";
            case XML_MAPPER:
                return resourcePath + "mapper" + File.separator + codeGenReqVo.getApiPath() + File.separator + className + "Mapper.xml";

            case RN_MODAL:
                return rootDir + File.separator + codeGenReqVo.getRnCopyPath() + File.separator + "modal" + File.separator + className + "Modal.tsx";
            case RN_VIEW:
                return rootDir + File.separator + codeGenReqVo.getRnCopyPath() + File.separator + "cube" + File.separator + className + "View.tsx";
            case RN_LIST:
                return rootDir + File.separator + codeGenReqVo.getRnCopyPath() + File.separator + className + "List.tsx";
            case RN_SERVICE:
                return rootDir + File.separator + rnRootPath + File.separator + "services" + File.separator + codeGenReqVo.getApiPath() + File.separator + classname + ".ts";
        }
        return "";
    }

    //首字母转小写
    public static String toLowerCaseFirstOne(String s) {
        if (Character.isLowerCase(s.charAt(0))) {
            return s;
        } else {
            return (new StringBuilder()).append(Character.toLowerCase(s.charAt(0))).append(s.substring(1)).toString();
        }
    }

    //首字母转大写
    public static String toUpperCaseFirstOne(String s) {
        if (Character.isUpperCase(s.charAt(0))) {
            return s;
        } else {
            return (new StringBuilder()).append(Character.toUpperCase(s.charAt(0))).append(s.substring(1)).toString();
        }
    }
}
