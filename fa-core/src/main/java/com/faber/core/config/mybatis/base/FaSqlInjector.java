package com.faber.core.config.mybatis.base;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ReflectUtil;
import com.baomidou.mybatisplus.core.injector.AbstractMethod;
import com.baomidou.mybatisplus.core.injector.DefaultSqlInjector;
import com.baomidou.mybatisplus.core.injector.methods.DeleteById;
import com.baomidou.mybatisplus.core.injector.methods.DeleteByIds;
import com.baomidou.mybatisplus.core.injector.methods.SelectById;
import com.baomidou.mybatisplus.core.injector.methods.UpdateById;
import com.baomidou.mybatisplus.core.metadata.TableInfo;
import com.faber.core.config.mybatis.methods.DeleteAll;
import com.faber.core.config.mybatis.methods.DeleteAllIgnoreLogic;
import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;
import java.util.List;

/**
 * 自定义Sql注入
 *
 * @author nieqiurong 2018/8/11 20:23.
 */
public class FaSqlInjector extends DefaultSqlInjector {

    @Override
    public List<AbstractMethod> getMethodList(Class<?> mapperClass, TableInfo tableInfo) {
        List<AbstractMethod> methodList = super.getMethodList(mapperClass, tableInfo);

//        methodList.add(new DeleteAll("deleteAll"));
//        methodList.add(new DeleteAllIgnoreLogic("deleteAllIgnoreLogic"));

        //增加自定义方法-忽略逻辑删除，追加后缀IgnoreLogic
        methodList.add(enhancerMethod(new SelectById()));
        methodList.add(enhancerMethod(new UpdateById()));
        methodList.add(enhancerMethod(new DeleteById()));
        methodList.add(enhancerMethod(new DeleteByIds()));

        return methodList;
    }

    /**
     * 增强方法-忽略逻辑删除，追加后缀IgnoreLogic
     * @param method
     * @return
     */
    private AbstractMethod enhancerMethod(AbstractMethod method){
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(method.getClass());
        enhancer.setCallback(new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                if(method.getName().equals("inject")){
                    TableInfo tableInfo = (TableInfo) objects[3];
                    if(tableInfo.isWithLogicDelete()) {
                        TableInfo tableInfo1 = new TableInfo(tableInfo.getConfiguration(), tableInfo.getEntityType());
                        BeanUtil.copyProperties(tableInfo, tableInfo1);
                        ReflectUtil.setFieldValue(tableInfo1, "withLogicDelete" , false);
                        objects[3] = tableInfo1;
                    }
                }
                return methodProxy.invokeSuper(o, objects);
            }
        });
        return (AbstractMethod) enhancer.create(new Class[]{String.class}, new Object[]{ReflectUtil.getFieldValue(method, "methodName" ) + "IgnoreLogic"});
    }

}
