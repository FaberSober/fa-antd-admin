package com.faber.buzz.disk.rest;

import com.faber.buzz.disk.entity.DiskFile;
import com.faber.common.vo.msg.Ret;
import com.faber.common.web.rest.BaseController;
import com.faber.buzz.disk.biz.DiskFileBiz;
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