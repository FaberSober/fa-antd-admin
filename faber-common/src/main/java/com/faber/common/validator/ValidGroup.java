package com.faber.common.validator;

import javax.validation.groups.Default;

/**
 * 分组校验
 * 参考：http://www.45fan.com/article.php?aid=1D2CNY5HBM62RmJc
 * 章节：3. 分组校验
 */
public interface ValidGroup extends Default {
    interface Crud extends ValidGroup{
        interface Create extends Crud{
        }
        interface Update extends Crud{
        }
        interface Query extends Crud{
        }
        interface Delete extends Crud{
        }
    }
}
