package com.faber.api.disk.rest;

import com.faber.api.disk.entity.DiskFile;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import com.faber.api.disk.biz.DiskFileBiz;
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
    public Ret<Boolean> updateName(@RequestBody Map<String, Object> params) {
        baseBiz.updateName(params);
        return ok();
    }

}