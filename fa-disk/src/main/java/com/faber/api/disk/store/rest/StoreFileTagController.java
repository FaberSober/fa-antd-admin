package com.faber.api.disk.store.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.disk.store.biz.StoreFileTagBiz;
import com.faber.api.disk.store.entity.StoreFileTag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * STORE-文件-标签
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-27 11:25:19
 */
@FaLogBiz("STORE-文件-标签")
@RestController
@RequestMapping("/api/disk/store/fileTag")
public class StoreFileTagController extends BaseController<StoreFileTagBiz, StoreFileTag, Integer> {

}