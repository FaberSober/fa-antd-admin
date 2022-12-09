package com.faber.api.base.admin.rest;

import com.alibaba.fastjson.JSONObject;
import com.faber.api.base.admin.biz.FileSaveBiz;
import com.faber.api.base.admin.entity.FileSave;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.annotation.LogNoRet;
import com.faber.core.web.rest.BaseController;
import com.faber.core.vo.msg.Ret;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/api/base/admin/fileSave")
public class FileSaveController extends BaseController<FileSaveBiz, FileSave, String> {

    /**
     * 通用上传文件
     * @param file
     * @return
     * @throws IOException
     */
    @PostMapping("/upload")
    @ResponseBody
    public Ret<FileSave> upload(@RequestParam("file") MultipartFile file) throws IOException {
        FileSave data = baseBiz.upload(file);
        return ok(data);
    }

    /**
     * 【七牛云】获取七牛云上传token
     * @return
     */
    @GetMapping("/getQiniuUploadToken")
    @ResponseBody
    public Ret<JSONObject> getQiniuUploadToken() {
        JSONObject json = baseBiz.getQiniuUploadToken();
        return ok(json);
    }

    /**
     * 根据文件ID返回文件流
     * @param fileId
     * @throws IOException
     */
    @GetMapping("/getFile/{fileId}")
    @ResponseBody
    @IgnoreUserToken
    @LogNoRet
    public void getFile(@PathVariable("fileId") String fileId) throws IOException {
        baseBiz.getFile(fileId);
    }

}
