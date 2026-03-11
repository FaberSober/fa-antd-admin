package com.faber.api.base.admin.rest;

import cn.hutool.core.map.MapUtil;
import jakarta.annotation.Resource;

import com.alibaba.fastjson2.JSONObject;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.faber.api.base.admin.biz.FileSaveBiz;
import com.faber.api.base.admin.entity.FileSave;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.annotation.LogNoRet;
import com.faber.core.config.annotation.ApiToken;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.service.ConfigSysService;
import com.faber.core.utils.FaFileUploadUtils;
import com.faber.core.vo.config.FaConfig;
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

    @Resource ConfigSysService configSysService;

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

    @FaLogOpr(value = "同步七牛云URL信息", crud = LogCrudEnum.C)
    @PostMapping("/syncUrlQiniu")
    @ResponseBody
    public Ret<FileSave> syncUrlQiniu(@RequestBody Map<String, Object> params) {
        String url = MapUtil.getStr(params, "url");
        FileSave data = baseBiz.syncUrlQiniu(url);
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

   @FaLogOpr("七牛云token")
   @GetMapping("/getQiniuUploadToken")
   @ResponseBody
   public Ret<JSONObject> getQiniuUploadToken() {
        FaConfig faConfig = configSysService.getConfig();
        String token = FaFileUploadUtils.getQiniuUploadToken(faConfig.getQiniuAk(), faConfig.getQiniuSk(), faConfig.getQiniuBucketName());

        JSONObject data = new JSONObject();
        data.put("token", token);
        data.put("domain", faConfig.getQiniuDomain());
        data.put("bucketName", faConfig.getQiniuBucketName());
        data.put("basePath", faConfig.getQiniuBasePath());
        return ok(data);
    }

    @GetMapping("/getWorkerId")
    @ResponseBody
    public Ret<String> getWorkerId() {
        String id = IdWorker.getId() + "";
        return ok(id);
    }

    @FaLogOpr(value = "上传文件-通过api上传", crud = LogCrudEnum.C)
    @PostMapping("/uploadByApi")
    @ApiToken
    @ResponseBody
    public Ret<FileSave> uploadByApi(@RequestParam("file") MultipartFile file) throws IOException {
        FileSave data = baseBiz.upload(file);
        return ok(data);
    }
}
