package com.faber.api.base.disk.biz;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.faber.api.base.disk.entity.DiskDir;
import com.faber.api.base.disk.entity.DiskFile;
import com.faber.api.base.disk.mapper.DiskDirMapper;
import com.faber.api.base.disk.vo.DiskDirVO;
import com.faber.core.bean.BaseCrtEntity;
import com.faber.core.exception.BuzzException;
import com.faber.core.web.biz.BaseTreeBiz;
import org.apache.commons.collections4.MapUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 云盘/文件夹
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-07-13 10:36:38
 */
@Service
public class DiskDirBiz extends BaseTreeBiz<DiskDirMapper, DiskDir> {

    @Resource
    private DiskFileBiz diskFileBiz;

    private static final class Type {
        public static final String DIR = "dir";
        public static final String FILE = "file";
    }

    /**
     * 获取重名文件夹数量（相同父目录下）
     * @param entity
     * @return
     */
    public long checkSameNameCount(DiskDir entity) {
        return lambdaQuery()
                .eq(BaseCrtEntity::getCrtUser, getCurrentUserId())
                .eq(DiskDir::getParentId, entity.getParentId())
                .eq(DiskDir::getName, entity.getName())
                .ne(entity.getId() != null, DiskDir::getId, entity.getId())
                .count();
    }

    @Override
    public boolean save(DiskDir entity) {
        if (this.checkSameNameCount(entity) > 0) {
            throw new BuzzException("文件夹名称重复");
        }
        return super.save(entity);
    }

    @Override
    public boolean updateById(DiskDir entity) {
        if (this.checkSameNameCount(entity) > 0) {
            throw new BuzzException("文件夹名称重复");
        }
        return super.updateById(entity);
    }

    public void updateName(Map<String, Object> params) {
        int id = MapUtils.getInteger(params, "id");
        DiskDir diskDir = getById(id);

        diskDir.setName(MapUtils.getString(params, "name"));
        updateById(diskDir);
    }

    /**
     * 获取当前登录用户的下级目录文件夹&文件List
     *
     * @param path 目录路径，如：/path1/path2
     * @return
     */
    public List<DiskDir> mineListByPath(String path) {
        String[] paths = path.replaceFirst("/", "").split("/");

        List<DiskDir> pathDirList = new ArrayList<>();
        int indexDirId = -1; // 从根目录开始查找
        for (String pathName : paths) {
            List<DiskDir> list = lambdaQuery()
                    .eq(BaseCrtEntity::getCrtUser, getCurrentUserId())
                    .eq(DiskDir::getParentId, indexDirId)
                    .eq(DiskDir::getName, pathName)
                    .orderByAsc(DiskDir::getId)
                    .page(new Page<>(1, 1))
                    .getRecords();
            if (list == null || list.isEmpty()) {
                break;
            }
            pathDirList.add(list.get(0));
            indexDirId = list.get(0).getId();
        }
        return pathDirList;
    }


    /**
     * 获取当前登录用户的下级目录文件夹&文件List
     *
     * @param dirId 文件夹ID
     * @return
     */
    public List<Map<String, Object>> mineFileList(int dirId) {
        List<Map<String, Object>> list = new ArrayList<>();

        // 我的文件夹
        List<DiskDir> dirList = lambdaQuery()
                .eq(DiskDir::getCrtUser, getCurrentUserId())
                .eq(DiskDir::getParentId, dirId)
                .list();
        dirList.forEach(dir -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", dir.getId());
            map.put("name", dir.getName());
            map.put("type", Type.DIR);
            map.put("size", 0);
            map.put("updTime", dir.getUpdTime());

            list.add(map);
        });

        // 我的文件
        List<DiskFile> fileList = diskFileBiz.lambdaQuery()
                .eq(DiskFile::getCrtUser, getCurrentUserId())
                .eq(DiskFile::getDirId, dirId)
                .list();
        fileList.forEach(file -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", file.getId());
            map.put("name", file.getName());
            map.put("type", Type.FILE);
            map.put("size", file.getSize());
            map.put("fileType", file.getType());
            map.put("url", file.getUrl());
            map.put("updTime", file.getUpdTime());

            list.add(map);
        });

        return list;
    }

    public List<DiskDirVO> listSub(int parentId) {
        List<DiskDirVO> list = new ArrayList<>();

        List<DiskDir> dirList = lambdaQuery()
                .eq(DiskDir::getCrtUser, getCurrentUserId())
                .eq(DiskDir::getParentId, parentId)
                .list();
        dirList.forEach(dir -> {
            DiskDirVO vo = new DiskDirVO();
            BeanUtils.copyProperties(dir, vo);

            // 统计查询-是否有子目录
            long count = lambdaQuery()
                    .eq(DiskDir::getCrtUser, getCurrentUserId())
                    .eq(DiskDir::getParentId, dir.getId())
                    .count();
            vo.setHasChildren(count > 0);

            list.add(vo);
        });

        return list;
    }

    @Transactional
    public void oprBatch(Map<String, Object> params) {
        List<Map<String, Object>> sourceList = (List<Map<String, Object>>) params.get("sourceList"); // 源文件
        int toDirId = MapUtils.getIntValue(params, "toDirId"); // 目标文件夹
        String oprType = MapUtils.getString(params, "oprType"); // 操作类型：copy/move

        if (toDirId != -1) {
            DiskDir toDir = getById(toDirId);
        }

        sourceList.forEach(source -> {
            String type = MapUtils.getString(source, "type");
            int id = MapUtils.getInteger(source, "id");

            if (Type.DIR.equals(type)) {
                DiskDir sourceDir = getById(id);

                if (toDirId == sourceDir.getParentId()) {
                    return;
                }

                // update parentId
                sourceDir.setParentId(toDirId);
                long count = this.checkSameNameCount(sourceDir);
                String oldName = sourceDir.getName();
                int addFlag = 1;
                while (count > 0) {
                    String newName = oldName + "(" + addFlag +")"; // 移动后文件夹新名称
                    sourceDir.setName(newName);
                    count = this.checkSameNameCount(sourceDir);
                    addFlag++;
                }

                if ("move".equals(oprType)) {
                    updateById(sourceDir);
                } else if ("copy".equals(oprType)) {
                    // 先复制文件夹
                    DiskDir newDiskDir = new DiskDir();
                    newDiskDir.setParentId(toDirId);
                    newDiskDir.setName(sourceDir.getName());
                    save(newDiskDir);

                    // 文件夹下属子节点也要复制
                    List<Map<String, Object>> childList = this.mineFileList(sourceDir.getId());
                    Map<String, Object> subOprParams = new HashMap<>();
                    subOprParams.put("sourceList", childList);
                    subOprParams.put("toDirId", newDiskDir.getId());
                    subOprParams.put("oprType", "copy");
                    // 递归调用copy方法
                    this.oprBatch(subOprParams);
                }
            } else if (Type.FILE.equals(type)) {
                DiskFile sourceFile = diskFileBiz.getById(id);

                if (toDirId == sourceFile.getDirId()) {
                    return;
                }

                // update dirId
                sourceFile.setDirId(toDirId);
                long count = diskFileBiz.checkSameNameCount(sourceFile);
                String oldName = sourceFile.getName();
                int addFlag = 1;
                while (count > 0) {
                    String newName = DiskFileBiz.fileNameAddSuffix(oldName, "(" + addFlag +")"); // 移动后文件新名称
                    sourceFile.setName(newName);
                    count = diskFileBiz.checkSameNameCount(sourceFile);
                    addFlag++;
                }

                if ("move".equals(oprType)) {
                    diskFileBiz.updateById(sourceFile);
                } else if ("copy".equals(oprType)) {
                    DiskFile newDiskFile = new DiskFile();
                    newDiskFile.setDirId(toDirId);
                    newDiskFile.setName(sourceFile.getName());
                    newDiskFile.setSize(sourceFile.getSize());
                    newDiskFile.setType(sourceFile.getType());
                    newDiskFile.setUrl(sourceFile.getUrl());

                    diskFileBiz.save(newDiskFile);
                }

            }
        });
    }

}