package com.faber.api.disk.store.rest;

import com.faber.api.disk.store.biz.StoreTagBiz;
import com.faber.api.disk.store.entity.StoreTag;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * STORE-标签
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-27 11:25:19
 */
@FaLogBiz("STORE-标签")
@RestController
@RequestMapping("/api/disk/store/tag")
public class StoreTagController extends BaseTreeController<StoreTagBiz, StoreTag, Integer> {

}