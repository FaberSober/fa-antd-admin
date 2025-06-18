package com.faber.api.base.admin.rest;

import cn.hutool.core.map.MapUtil;
import com.faber.api.base.admin.biz.FileSaveBiz;
import com.faber.api.base.admin.entity.FileSave;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.annotation.LogNoRet;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@FaLogBiz("文件")
@Controller
@RequestMapping("/api/base/admin/fileSave")
public class FileSaveController extends BaseController<FileSaveBiz, FileSave, String> {

    @FaLogOpr(value = "上传文件", crud = LogCrudEnum.C)
    @PostMapping("/upload")
    @ResponseBody
    public Ret<FileSave> upload(@RequestParam("file") MultipartFile file) throws IOException {
        FileSave data = baseBiz.upload(file);
        return ok(data);
    }

    @FaLogOpr(value = "URL上传文件", crud = LogCrudEnum.C)
    @PostMapping("/uploadFromUrl")
    @ResponseBody
    public Ret<FileSave> uploadFromUrl(@RequestBody Map<String, Object> params) {
        String url = MapUtil.getStr(params, "url");
        FileSave data = baseBiz.uploadFromUrl(url);
        return ok(data);
    }

    @FaLogOpr("文件分片获取")
    @GetMapping("/getFile/{fileId}")
    @ResponseBody
    @IgnoreUserToken
    @LogNoRet
    public void getFile(@PathVariable("fileId") String fileId) throws IOException {
        baseBiz.downloadFileById(fileId);
    }

    @FaLogOpr("图片缩略图")
    @GetMapping("/getFilePreview/{fileId}")
    @ResponseBody
    @IgnoreUserToken
    @LogNoRet
    public void getFilePreview(@PathVariable("fileId") String fileId) throws IOException {
        baseBiz.getFilePreview(fileId);
    }

    @FaLogOpr("文件字符获取")
    @GetMapping("/getFileStr/{fileId}")
    @ResponseBody
    @IgnoreUserToken
    @LogNoRet
    public Ret<String> getFileStr(@PathVariable("fileId") String fileId) {
        String data = baseBiz.getFileStr(fileId);
        return ok(data);
    }

//    @FaLogOpr("七牛云token")
//    @GetMapping("/getQiniuUploadToken")
//    @ResponseBody
//    public Ret<JSONObject> getQiniuUploadToken() {
//        JSONObject json = baseBiz.getQiniuUploadToken();
//        return ok(json);
//    }

}
