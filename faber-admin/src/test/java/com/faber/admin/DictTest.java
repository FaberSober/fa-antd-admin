package com.faber.admin;

import com.faber.AdminBootstrap;
import com.faber.api.base.admin.biz.DictTypeBiz;
import com.faber.api.base.admin.vo.ret.SystemConfigPo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DictTest {

    @Resource
    private DictTypeBiz dictTypeBiz;

//    @Resource
//    private DictBiz dictBiz;

//    /**
//     * 将dict数据搬迁到dictType.dict的json数据中
//     */
//    @Test
//    public void testMoveDictToJson() {
//        List<DictType> dictTypeList = dictTypeBiz.lambdaQuery().list();
//        for (DictType dictType : dictTypeList) {
//            List<Dict> dictList = dictBiz.lambdaQuery().eq(Dict::getType, dictType.getId()).list();
//
//            List<DictType.Dict> newList = new ArrayList<>();
//            for (int i = 0; i < dictList.size(); i++) {
//                Dict dict = dictList.get(i);
//
//                DictType.Dict dict1 = new DictType.Dict();
//                dict1.setId(i);
//                dict1.setValue(dict.getValue());
//                dict1.setLabel(dict.getText());
//                dict1.setDeleted(false);
//                newList.add(dict1);
//            }
//
//            dictType.setDicts(newList);
//            dictTypeBiz.updateById(dictType);
//        }
//    }

    @Test
    public void testGetSystemConfig() {
        SystemConfigPo systemConfigPo = dictTypeBiz.getSystemConfig();
        System.out.println(systemConfigPo);
    }

}
