package com.faber.admin.rest;

import com.alibaba.fastjson.JSONObject;
import com.faber.admin.biz.FileSaveBiz;
import com.faber.admin.config.annotation.IgnoreUserToken;
import com.faber.admin.entity.FileSave;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/api/admin/fileSave")
public class FileSaveController extends BaseController<FileSaveBiz, FileSave> {

    @GetMapping("/getUploadToken")
    @ResponseBody
    public ObjectRestResponse<JSONObject> getUploadToken() {
        JSONObject json = baseBiz.getUploadToken();
        return ok(json);
    }

    /**
     * 获取七牛云上传token(提供给官网会员账户)
     * @return
     */
    @GetMapping("/getUploadTokenPortal")
    @ResponseBody
    @IgnoreUserToken
    public ObjectRestResponse<JSONObject> getUploadTokenPortal() {
        JSONObject json = baseBiz.getUploadToken();
        return ok(json);
    }

    @GetMapping("/getMine")
    @ResponseBody
    public ObjectRestResponse<List<FileSave>> getMine() {
        List<FileSave> list = baseBiz.getMine();
        return ok(list);
    }

    @PostMapping("/deleteMine")
    @ResponseBody
    public ObjectRestResponse<Boolean> deleteMine(@RequestBody JSONObject json) {
        baseBiz.deleteMine(json);
        return ok(true);
    }

    @PostMapping("/uploadHtmlImage")
    @ResponseBody
//    @IgnoreUserToken
    public JSONObject uploadHtmlImage(@RequestParam("file") MultipartFile file) throws IOException {
        JSONObject jo = baseBiz.uploadToQiniu(file, "html/file");
        return jo;
    }

    @PostMapping("/uploadImage")
    @ResponseBody
//    @IgnoreUserToken
    public ObjectRestResponse<JSONObject> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        JSONObject jo = baseBiz.uploadToQiniu(file, "file");
        return ok(jo);
    }

    @PostMapping("/uploadEditor")
    @ResponseBody
    public ObjectRestResponse<String> uploadEditor(@RequestParam("file") MultipartFile file) throws IOException {
        JSONObject jo = baseBiz.uploadToQiniu(file, "editor/file");
        String url = jo.getString("url");
        return ok(url);
    }

    @PostMapping("/local/uploadFile")
    @ResponseBody
    public ObjectRestResponse<FileSave> uploadLocalFile(@RequestParam("file") MultipartFile file) throws IOException {
        FileSave data = baseBiz.uploadLocalFile(file);
        return ok(data);
    }

    @GetMapping("/local/getFile/{fileId}")
    @ResponseBody
    @IgnoreUserToken
    public void getLocalFile(@PathVariable("fileId") String fileId) throws IOException {
        baseBiz.getLocalFile(fileId);
    }

    @GetMapping("/local/getLocalFile")
    @ResponseBody
    @IgnoreUserToken
    public void getLocalFilePath(@RequestParam("filePath") String filePath) throws IOException {
        baseBiz.getLocalFilePath(filePath);
    }

//    @PostMapping("/uploadHtmlImage")
//    @ResponseBody
//    @ApiOperation(value = "附件上传", notes = "附件上传")
////    @IgnoreUserToken
//    public JSONObject uploadHtmlImage(@ApiParam(required = true, name = "file", value = "用户信息Excel") @RequestParam("file") MultipartFile file) throws IOException {
//        String date = DateUtil.today();
//        String fullPath = qiniuHelper.upload(file.getInputStream(), "static/html/image/" + date + "/" + UUID.randomUUID().toString() + "/" + file.getOriginalFilename());
//        JSONObject jo = new JSONObject();
//        jo.put("state", "SUCCESS");
//        jo.put("url", fullPath);
//        jo.put("title", file.getOriginalFilename());
//        jo.put("original", file.getOriginalFilename());
//        return jo;
//    }

}
