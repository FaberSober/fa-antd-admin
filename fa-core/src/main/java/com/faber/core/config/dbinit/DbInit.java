package com.faber.core.config.dbinit;

/**
 * 继承此接口，实现数据库自动建表、更新表结构
 *
 * @author Farando
 * @date 2023/2/18 20:09
 * @description
 */
public interface DbInit {

    /**
     * 返回模块的执行顺序，越小越早执行。(base模块需要设置的小，先执行)
     * @return
     */
    default Integer getOrder() {
        return 10;
    };

    /**
     * 返回模块编码，如：fa-base。
     * sql文件需要存放到sql/fa-base目录下
     * @return
     */
    String getNo();

    /**
     * 返回模块名称，如：基础模块
     * @return
     */
    String getName();

}
