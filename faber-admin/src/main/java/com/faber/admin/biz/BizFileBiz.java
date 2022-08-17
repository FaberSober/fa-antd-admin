package com.faber.admin.biz;

import com.faber.admin.mapper.BizFileMapper;
import com.faber.admin.entity.BizFile;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.biz.BaseBiz;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;

import java.util.List;

/**
 * html文章
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-17 20:15:13
 */
@Service
public class BizFileBiz extends BaseBiz<BizFileMapper, BizFile> {

    public List<BizFile> getByBizId(Object bizId, BizFile.BizType bizType) {
        Example example = new Example(BizFile.class);
        example.createCriteria()
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("bizId", bizId)
                .andEqualTo("bizType", bizType.value);
        example.setOrderByClause("id ASC");
        return mapper.selectByExample(example);
    }

}