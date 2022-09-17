package com.faber.admin.biz;

import cn.hutool.core.date.DateUtil;
import com.alibaba.fastjson.JSONObject;
import com.faber.admin.entity.FileSave;
import com.faber.admin.mapper.FileSaveMapper;
import com.faber.common.bean.BaseCrtEntity;
import com.faber.common.biz.BaseBiz;
import com.faber.common.context.BaseContextHandler;
import com.faber.common.exception.BuzzException;
import com.faber.common.file.QiniuHelper;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;


import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import java.io.*;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.List;

/**
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-19 10:09:36
 */
@Service
public class FileSaveBiz extends BaseBiz<FileSaveMapper, FileSave> {

    @Resource
    private QiniuHelper qiniuHelper;

    public JSONObject getUploadToken() {
        String token = qiniuHelper.getUploadToken();
        JSONObject data = new JSONObject();
        data.put("token", token);
        data.put("host", qiniuHelper.getHost());
        return data;
    }

    public List<FileSave> getMine() {
        return lambdaQuery()
                .eq(BaseCrtEntity::getCrtUser, getCurrentUserId())
                .orderByAsc(FileSave::getId)
                .list();
    }

    public void deleteMine(JSONObject json) {
        String userId = BaseContextHandler.getUserID();
        String ids = json.getString("ids");
        String[] idArr = ids.split(",");
        Arrays.asList(idArr).parallelStream().forEach(id -> {
            FileSave fileSave = getById(id);
            if (fileSave != null && userId.equals(fileSave.getCrtUser())) {
                // 删除七牛云上的文件
                qiniuHelper.delete(fileSave.getUrl());
                removeById(id);
            }
        });
    }

    /**
     * 上传文件到七牛云
     * @param file
     * @param dir 前置路径，如：user/import
     * @return
     * @throws IOException
     */
    public JSONObject uploadToQiniu(MultipartFile file, String dir) throws IOException {
        // 拼接路径
        String path = dir + "/" + DateUtil.today() + "/" + com.faber.common.util.FileUtils.addTimestampToFileName(file.getOriginalFilename());

        String fullPath = qiniuHelper.upload(file.getInputStream(), path);
        JSONObject jo = new JSONObject();
        jo.put("state", "SUCCESS");
        jo.put("url", fullPath);
        jo.put("title", file.getOriginalFilename());
        jo.put("original", file.getOriginalFilename());
        return jo;
    }

    /**
     * 上传文件到本地
     * @param file
     * @return
     * @throws IOException
     */
    public FileSave uploadLocalFile(MultipartFile file) throws IOException {
        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if (!path.exists()) path = new File("");

        String fileSavePath = "/static/" + qiniuHelper.getPrefix() + "/file/" + DateUtil.today() + "/"
                + com.faber.common.util.FileUtils.addTimestampToFileName(file.getOriginalFilename());

        File exportFile = new File(path.getAbsolutePath(), fileSavePath);
        FileUtils.copyInputStreamToFile(file.getInputStream(), exportFile);

        FileSave fileSaveEntity = new FileSave();
        fileSaveEntity.setName(file.getOriginalFilename());
        fileSaveEntity.setSize(file.getSize());
        fileSaveEntity.setUrl(fileSavePath);

        save(fileSaveEntity);

        return fileSaveEntity;
    }

    public File getLocalFileById(String fileId) throws IOException {
        FileSave fileSaveEntity = getById(fileId);

        if (fileSaveEntity == null) throw new BuzzException("未找到上传文件");
        return this.getLocalFileByFile(fileSaveEntity);
    }

    public File getLocalFileByFile(FileSave fileSaveEntity) throws IOException {
        if (fileSaveEntity.getUrl().contains("..")) {
            throw new BuzzException("非法文件名");
        }
        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if (!path.exists()) path = new File("");
//        File file = new ClassPathResource(fileEntity.getUrl()).getFile();
        File file = new File(path.getAbsolutePath(), fileSaveEntity.getUrl());

        if (!file.exists()) {
            throw new BuzzException("文件未找到");
        }

        return file;
    }

    public void getLocalFile(String fileId) throws IOException {
        FileSave fileSaveEntity = getById(fileId);
        this.getLocalFilePath(fileSaveEntity.getUrl());
    }

    /**
     * 根据文件路径，获取存储文件，返回到http流进行下载
     * @param filePath
     * @throws IOException
     */
    public void getLocalFilePath(String filePath) throws IOException {
        if (filePath.contains("..")) {
            throw new BuzzException("非法文件名");
        }

        if (!filePath.startsWith("/static")) {
            filePath = "/static" + filePath; // 默认追加static前缀文件夹
        }

        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if (!path.exists()) path = new File("");
        File file = new File(path.getAbsolutePath(), filePath);

        HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
        response.setCharacterEncoding("utf-8");
        String fileName = URLEncoder.encode(file.getName(), "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName);

        //4.获取要下载的文件输入流
        InputStream in = new FileInputStream(file);
        int len = 0;
        //5.创建数据缓冲区
        byte[] buffer = new byte[1024];
        //6.通过response对象获取OutputStream流
        OutputStream out = response.getOutputStream();
        //7.将FileInputStream流写入到buffer缓冲区
        while ((len = in.read(buffer)) > 0) {
            //8.使用OutputStream将缓冲区的数据输出到客户端浏览器
            out.write(buffer, 0, len);
        }
        in.close();
    }

}
