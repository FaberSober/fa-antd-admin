package com.faber.core.config.validator.validator;

import jakarta.validation.groups.Default;

/**
 * Validator Group 校验分组
 * 参考：http://www.45fan.com/article.php?aid=1D2CNY5HBM62RmJc
 * 章节：3. 分组校验
 * @author xu.pengfei
 * @date 2022/11/28 14:34
 */
public interface Vg extends Default {

    interface Crud extends Vg {
        /**
         * Create
         */
        interface C extends Crud{
        }
        /**
         * Read
         */
        interface R extends Crud{
        }
        /**
         * Update
         */
        interface U extends Crud{
        }
        /**
         * Delete
         */
        interface D extends Crud{
        }
    }

}
