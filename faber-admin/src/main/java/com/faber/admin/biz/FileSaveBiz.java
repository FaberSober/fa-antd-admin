package com.faber.admin.biz;

import cn.hutool.core.util.URLUtil;
import com.alibaba.fastjson.JSONObject;
import com.faber.admin.entity.FileSave;
import com.faber.admin.mapper.FileSaveMapper;
import com.faber.common.biz.BaseBiz;
import com.faber.common.file.FileHelperImpl;
import com.faber.common.file.impl.FileHelperLocal;
import com.faber.common.utils.file.QiniuHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-19 10:09:36
 */
@Service
public class FileSaveBiz extends BaseBiz<FileSaveMapper, FileSave> {

    @Resource
    private FileHelperImpl fileHelper;

    @Resource
    private QiniuHelper qiniuHelper;

    @Override
    public boolean save(FileSave entity) {
        entity.setDrive(fileHelper.getDrive());
        return super.save(entity);
    }

    public FileSave upload(MultipartFile file) throws IOException {
        String url = fileHelper.upload(file);

        FileSave fileSaveEntity = new FileSave();
        fileSaveEntity.setName(file.getOriginalFilename());
        fileSaveEntity.setSize(file.getSize());
        fileSaveEntity.setUrl(url);

        save(fileSaveEntity);

        fileSaveEntity.setLocalUrl("/api/admin/fileSave/getFile/" + fileSaveEntity.getId());
        return fileSaveEntity;
    }

    public void getFile(String fileId) throws IOException {
        FileSave fileSaveEntity = getById(fileId);

        switch (fileSaveEntity.getDrive()) {
            case LOCAL:
                FileHelperLocal.getLocalFilePath(fileSaveEntity.getUrl());
                break;
            case QINIU:
            case ALI:
            case TX:
                HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
                response.sendRedirect(URLUtil.encode(fileSaveEntity.getUrl()));
                break;
        }
    }

    public JSONObject getQiniuUploadToken() {
        String token = qiniuHelper.getUploadToken();
        JSONObject data = new JSONObject();
        data.put("token", token);
        data.put("host", qiniuHelper.getHost());
        return data;
    }

}
