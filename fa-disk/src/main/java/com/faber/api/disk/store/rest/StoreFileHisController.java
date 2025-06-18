package com.faber.api.disk.store.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.disk.store.biz.StoreFileHisBiz;
import com.faber.api.disk.store.entity.StoreFileHis;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * STORE-文件-历史记录
 *
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2023-03-15 16:31:06
 */
@FaLogBiz("STORE-文件-历史记录")
@RestController
@RequestMapping("/api/disk/store/storeFileHis")
public class StoreFileHisController extends BaseController<StoreFileHisBiz, StoreFileHis, Integer> {

}