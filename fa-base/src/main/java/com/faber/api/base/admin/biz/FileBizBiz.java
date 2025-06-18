package com.faber.api.base.admin.biz;

import cn.hutool.core.util.StrUtil;
import com.faber.api.base.admin.entity.FileSave;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.faber.api.base.admin.entity.FileBiz;
import com.faber.api.base.admin.mapper.FileBizMapper;
import com.faber.core.web.biz.BaseBiz;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * BASE-通用业务附件表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-03-05 14:49:12
 */
@Service
public class FileBizBiz extends BaseBiz<FileBizMapper,FileBiz> {

    @Lazy
    @Resource
    FileSaveBiz fileSaveBiz;

    @Override
    protected void saveBefore(FileBiz entity) {
        FileSave fileSave = fileSaveBiz.getByIdWithCache(entity.getFileId());
        entity.setFileName(fileSave.getOriginalFilename());
        entity.setExt(fileSave.getExt());

        super.saveBefore(entity);
    }

    public FileBiz saveFile(String mainBizId, String bizId, String type, String fileId) {
        return this.saveFile(mainBizId, bizId, type, fileId, 0);
    }

    public FileBiz saveFile(String mainBizId, String bizId, String type, String fileId, Integer sort) {
        FileBiz fileBiz = new FileBiz();
        fileBiz.setMainBizId(mainBizId);
        fileBiz.setBizId(bizId);
        fileBiz.setType(type);
        fileBiz.setFileId(fileId);
        fileBiz.setSort(sort);
        this.save(fileBiz);
        return fileBiz;
    }

    /**
     * 批量保存业务数据
     * @param mainBizId 主业务ID，如：订单ID
     * @param bizId 业务ID，如：订单明细ID，可以为空
     * @param type 业务类型，如：订单附件 ORDER_FILES
     * @param fileIds 附件ID列表
     * @return
     */
    public List<FileBiz> saveBatch(Object mainBizId, Object bizId, String type, List<String> fileIds) {
        return this.saveBatch(StrUtil.toString(mainBizId), StrUtil.toString(bizId), type, fileIds, true);
    }

    public List<FileBiz> saveBatch(Object mainBizId, Object bizId, String type, List<String> fileIds, boolean deleteBeforeSave) {
        // delete before save
        if (deleteBeforeSave) {
            this.lambdaUpdate()
                    .eq(FileBiz::getMainBizId, StrUtil.toString(mainBizId))
                    .eq(FileBiz::getBizId, StrUtil.toString(bizId))
                    .eq(FileBiz::getType, type)
                    .remove();
        }

        if (fileIds == null) return Collections.emptyList();

        List<FileBiz> list = new ArrayList<>();
        for (int i = 0; i < fileIds.size(); i++){
            String fileId = fileIds.get(i);
            FileBiz fileBiz = this.saveFile(StrUtil.toString(mainBizId), StrUtil.toString(bizId), type, fileId, i + 1);
            list.add(fileBiz);
        }
        return list;
    }

    public List<FileBiz> getFiles(Object mainBizId, Object bizId, String type) {
        return this.lambdaQuery()
               .eq(FileBiz::getMainBizId, mainBizId)
               .eq(FileBiz::getBizId, bizId)
               .eq(FileBiz::getType, type)
               .orderByAsc(FileBiz::getId)
               .list();
    }

}
