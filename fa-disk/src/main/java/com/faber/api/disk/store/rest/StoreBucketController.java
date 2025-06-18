package com.faber.api.disk.store.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import com.faber.api.disk.store.biz.StoreBucketBiz;
import com.faber.api.disk.store.entity.StoreBucket;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * STORE-库
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-22 09:31:17
 */
@FaLogBiz("网盘/库")
@RestController
@RequestMapping("/api/disk/store/bucket")
public class StoreBucketController extends BaseController<StoreBucketBiz, StoreBucket, Integer> {

    @FaLogOpr("个人库列表")
    @RequestMapping(value = "/getMyList", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<StoreBucket>> getMyList() {
        List<StoreBucket> o = baseBiz.getMyList();
        return ok(o);
    }

}