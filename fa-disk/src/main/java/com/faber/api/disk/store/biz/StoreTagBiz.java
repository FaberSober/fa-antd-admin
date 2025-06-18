package com.faber.api.disk.store.biz;

import com.faber.api.disk.store.entity.StoreTag;
import com.faber.api.disk.store.mapper.StoreTagMapper;
import com.faber.core.web.biz.BaseTreeBiz;
import org.springframework.stereotype.Service;

/**
 * STORE-标签
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-27 11:25:19
 */
@Service
public class StoreTagBiz extends BaseTreeBiz<StoreTagMapper,StoreTag> {
}