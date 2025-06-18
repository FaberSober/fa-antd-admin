package com.faber.api.disk.store.rest;

import com.faber.api.disk.store.biz.StoreBucketUserBiz;
import com.faber.api.disk.store.entity.StoreBucketUser;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * STORE-库-人员关联
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-28 11:14:56
 */
@FaLogBiz("网盘/库/人员关联")
@RestController
@RequestMapping("/api/disk/store/bucketUser")
public class StoreBucketUserController extends BaseController<StoreBucketUserBiz, StoreBucketUser, Integer> {

    @FaLogOpr(value = "更新库人员", crud = LogCrudEnum.C)
    @RequestMapping(value = "/updateBucketUser", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateBucketUser(@RequestBody List<StoreBucketUser> list) {
        baseBiz.updateBucketUser(list);
        return ok();
    }

}
