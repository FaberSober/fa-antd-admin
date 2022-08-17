package com.faber.disk.biz;

import com.faber.common.bean.BaseDelEntity;
import com.faber.common.biz.BaseBiz;
import com.faber.common.exception.BuzzException;
import com.faber.disk.entity.DiskFile;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.stereotype.Service;

import com.faber.disk.mapper.DiskFileMapper;
import tk.mybatis.mapper.entity.Example;

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

    public int checkSameNameCount(DiskFile entity) {
        String userId = getCurrentUserId();
        Example example = new Example(DiskFile.class);
        example.createCriteria().andEqualTo("crtUser", userId)
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("dirId", entity.getDirId())
                .andEqualTo("name", entity.getName());
        if (entity.getId() != null) {
            example.and().andNotEqualTo("id", entity.getId());
        }
        return mapper.selectCountByExample(example);
    }

    @Override
    public void insertSelective(DiskFile entity) {
        // 新增文件，如果有重名文件，更新文件名称
        int count = this.checkSameNameCount(entity);
        if (count > 0) {
            String newName = fileNameAddSuffix(entity.getName(), DateFormatUtils.format(System.currentTimeMillis(), "_yyyyMMdd_HHmmss"));
            entity.setName(newName);
        }

        super.insertSelective(entity);
    }

    @Override
    public void updateSelectiveById(DiskFile entity) {
        // 更新文件，如果有重名文件，提升更新失败
        int count = this.checkSameNameCount(entity);
        if (count > 0) {
            throw new BuzzException("文件名称重复");
        }
        super.updateSelectiveById(entity);
    }

    public void updateName(Map<String, Object> params) {
        int id = MapUtils.getInteger(params, "id");
        DiskFile diskFile = mapper.selectByPrimaryKey(id);
        checkBeanValid(diskFile);

        diskFile.setName(MapUtils.getString(params, "name"));
        this.updateSelectiveById(diskFile);
    }

    /**
     * 文件名追加后缀，后缀加在最后一点.之前
     * @param fileName
     * @param suffix
     * @return
     */
    public static String fileNameAddSuffix(String fileName, String suffix) {
        if (fileName.indexOf(".") == -1) {
            return fileName + suffix;
        }

        String pre = fileName.substring(0, fileName.lastIndexOf("."));
        String end = fileName.substring(fileName.lastIndexOf("."));
        return pre + suffix + end;
    }

}