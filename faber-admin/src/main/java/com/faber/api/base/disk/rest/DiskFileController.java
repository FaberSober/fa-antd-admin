package com.faber.api.base.disk.rest;

import com.faber.api.base.disk.biz.DiskFileBiz;
import com.faber.api.base.disk.entity.DiskFile;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/base/disk/file")
public class DiskFileController extends BaseController<DiskFileBiz, DiskFile, Integer> {

    /**
     * 更新文件名称
     */
    @RequestMapping(value = "/updateName", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateName(@RequestBody Map<String, Object> params) {
        baseBiz.updateName(params);
        return ok();
    }

}