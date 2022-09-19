package com.faber.disk.rest;

import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import com.faber.disk.biz.DiskFileBiz;
import com.faber.disk.entity.DiskFile;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/disk/file")
public class DiskFileController extends BaseController<DiskFileBiz, DiskFile, Integer> {

    /**
     * 更新文件名称
     */
    @RequestMapping(value = "/updateName", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> updateName(@RequestBody Map<String, Object> params) {
        baseBiz.updateName(params);
        return ok();
    }

}