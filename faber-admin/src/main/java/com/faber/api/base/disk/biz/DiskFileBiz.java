package com.faber.api.base.disk.biz;

import cn.hutool.core.map.MapUtil;
import com.faber.api.base.disk.entity.DiskFile;
import com.faber.api.base.disk.mapper.DiskFileMapper;
import com.faber.core.bean.BaseCrtEntity;
import com.faber.core.web.biz.BaseBiz;
import com.faber.core.exception.BuzzException;
import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * 云盘/文件
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-07-13 10:36:38
 */
@Service
public class DiskFileBiz extends BaseBiz<DiskFileMapper, DiskFile> {

    public long checkSameNameCount(DiskFile entity) {
        return lambdaQuery()
                .eq(BaseCrtEntity::getCrtUser, getCurrentUserId())
                .eq(DiskFile::getDirId, entity.getDirId())
                .eq(DiskFile::getName, entity.getName())
                .ne(entity.getId() != null, DiskFile::getId, entity.getId())
                .count();
    }

    @Override
    public boolean save(DiskFile entity) {
        long count = this.checkSameNameCount(entity);
        if (count > 0) {
            String newName = fileNameAddSuffix(entity.getName(), "(1)");
            entity.setName(newName);
        }
        return super.save(entity);
    }

    @Override
    public boolean updateById(DiskFile entity) {
        // 更新文件，如果有重名文件，提升更新失败
        long count = this.checkSameNameCount(entity);
        if (count > 0) {
            throw new BuzzException("文件名称重复");
        }
        return super.updateById(entity);
    }

    public void updateName(Map<String, Object> params) {
        DiskFile diskFile = getById(MapUtil.getInt(params, "id"));
        diskFile.setName(MapUtils.getString(params, "name"));
        updateById(diskFile);
    }

    /**
     * 文件名追加后缀，后缀加在最后一点.之前
     * @param fileName
     * @param suffix
     * @return
     */
    public static String fileNameAddSuffix(String fileName, String suffix) {
        if (!fileName.contains(".")) {
            return fileName + suffix;
        }

        String pre = fileName.substring(0, fileName.lastIndexOf("."));
        String end = fileName.substring(fileName.lastIndexOf("."));
        return pre + suffix + end;
    }

}