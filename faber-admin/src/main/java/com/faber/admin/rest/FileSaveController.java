package com.faber.admin.rest;

import com.alibaba.fastjson.JSONObject;
import com.faber.admin.biz.FileSaveBiz;
import com.faber.admin.config.annotation.IgnoreUserToken;
import com.faber.admin.entity.FileSave;
import com.faber.common.rest.BaseController;
import com.faber.common.vo.msg.ObjectRestResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/api/admin/fileSave")
public class FileSaveController extends BaseController<FileSaveBiz, FileSave, String> {

    /**
     * 通用上传文件
     * @param file
     * @return
     * @throws IOException
     */
    @PostMapping("/uploadFile")
    @ResponseBody
    public ObjectRestResponse<FileSave> uploadLocalFile(@RequestParam("file") MultipartFile file) throws IOException {
        FileSave data = baseBiz.uploadFile(file);
        return ok(data);
    }

    /**
     * 【七牛云】获取七牛云上传token
     * @return
     */
    @GetMapping("/getQiniuUploadToken")
    @ResponseBody
    public ObjectRestResponse<JSONObject> getQiniuUploadToken() {
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
    public void getFile(@PathVariable("fileId") String fileId) throws IOException {
        baseBiz.getFile(fileId);
    }

}
