package com.faber.disk.biz;

import com.faber.common.bean.BaseDelEntity;
import com.faber.common.biz.BaseBiz;
import com.faber.common.exception.BuzzException;
import com.faber.disk.entity.DiskDir;
import com.faber.disk.entity.DiskFile;
import com.faber.disk.mapper.DiskDirMapper;
import com.faber.disk.vo.DiskDirVO;
import org.apache.commons.collections4.MapUtils;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.entity.Example;

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
public class DiskDirBiz extends BaseBiz<DiskDirMapper, DiskDir> {

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
    public int checkSameNameCount(DiskDir entity) {
        String userId = getCurrentUserId();
        Example example = new Example(DiskDir.class);
        example.createCriteria().andEqualTo("crtUser", userId)
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("parentId", entity.getParentId())
                .andEqualTo("name", entity.getName());
        if (entity.getId() != null) {
            example.and().andNotEqualTo("id", entity.getId());
        }
        return mapper.selectCountByExample(example);
    }

    @Override
    public void insertSelective(DiskDir entity) {
        // 插入文件夹，不能有重复名称的文件夹
        int count = this.checkSameNameCount(entity);
        if (count > 0) {
            throw new BuzzException("文件夹名称重复");
        }

        super.insertSelective(entity);
    }

    @Override
    public void updateSelectiveById(DiskDir entity) {
        // 更新时，不能有重复名称的文件夹
        int count = this.checkSameNameCount(entity);
        if (count > 0) {
            throw new BuzzException("文件夹名称重复");
        }

        super.updateSelectiveById(entity);
    }

    public void updateName(Map<String, Object> params) {
        int id = MapUtils.getInteger(params, "id");
        DiskDir diskDir = mapper.selectByPrimaryKey(id);
        checkBeanValid(diskDir);

        diskDir.setName(MapUtils.getString(params, "name"));
        this.updateSelectiveById(diskDir);
    }

    /**
     * 获取当前登录用户的下级目录文件夹&文件List
     *
     * @param path 目录路径，如：/path1/path2
     * @return
     */
    public Map<String, Object> mineListByPath(String path) {
        Map<String, Object> data = new HashMap<>();

        String[] paths = path.replaceFirst("/", "").split("/");

        String userId = getCurrentUserId();

        List<DiskDir> pathDirList = new ArrayList<>();
        int indexDirId = -1; // 从根目录开始查找
        for (String pathName : paths) {
            Example example = new Example(DiskDir.class);
            example.createCriteria().andEqualTo("crtUser", userId)
                    .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                    .andEqualTo("parentId", indexDirId)
                    .andEqualTo("name", pathName);
            example.setOrderByClause("id DESC");
            List<DiskDir> list = mapper.selectByExampleAndRowBounds(example, new RowBounds(0, 1));
            if (list == null || list.isEmpty()) {
                break;
            }
            pathDirList.add(list.get(0));
            indexDirId = list.get(0).getId();
        }

        data.put("path", pathDirList);

        return data;
    }


    /**
     * 获取当前登录用户的下级目录文件夹&文件List
     *
     * @param dirId 文件夹ID
     * @return
     */
    public List<Map<String, Object>> mineList(int dirId) {
        List<Map<String, Object>> list = new ArrayList<>();

        String userId = getCurrentUserId();

        // 我的文件夹
        Example example = new Example(DiskDir.class);
        example.createCriteria().andEqualTo("crtUser", userId)
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("parentId", dirId);
        List<DiskDir> dirList = mapper.selectByExample(example);
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
        Example example1 = new Example(DiskFile.class);
        example1.createCriteria().andEqualTo("crtUser", userId)
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("dirId", dirId);
        List<DiskFile> fileList = diskFileBiz.selectByExample(example1);
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

        String userId = getCurrentUserId();

        Example example = new Example(DiskDir.class);
        example.createCriteria().andEqualTo("crtUser", userId)
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("parentId", parentId);

        List<DiskDir> dirList = mapper.selectByExample(example);
        dirList.forEach(dir -> {
            DiskDirVO vo = new DiskDirVO();
            BeanUtils.copyProperties(dir, vo);

            // 统计查询-是否有子目录
            Example example1 = new Example(DiskDir.class);
            example1.createCriteria().andEqualTo("crtUser", userId)
                    .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                    .andEqualTo("parentId", dir.getId());
            int count = mapper.selectCountByExample(example1);
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
            DiskDir toDir = mapper.selectByPrimaryKey(toDirId);
            checkBeanValid(toDir);
        }

        sourceList.forEach(source -> {
            String type = MapUtils.getString(source, "type");
            int id = MapUtils.getInteger(source, "id");

            if (Type.DIR.equals(type)) {
                DiskDir sourceDir = mapper.selectByPrimaryKey(id);

                if (toDirId == sourceDir.getParentId()) {
                    return;
                }

                // update parentId
                sourceDir.setParentId(toDirId);
                int count = this.checkSameNameCount(sourceDir);
                String oldName = sourceDir.getName();
                int addFlag = 1;
                while (count > 0) {
                    String newName = oldName + "(" + addFlag +")"; // 移动后文件夹新名称
                    sourceDir.setName(newName);
                    count = this.checkSameNameCount(sourceDir);
                    addFlag++;
                }

                if ("move".equals(oprType)) {
                    super.updateSelectiveById(sourceDir);
                } else if ("copy".equals(oprType)) {
                    // 先复制文件夹
                    DiskDir newDiskDir = new DiskDir();
                    newDiskDir.setParentId(toDirId);
                    newDiskDir.setName(sourceDir.getName());
                    super.insertSelective(newDiskDir);

                    // 文件夹下属子节点也要复制
                    List<Map<String, Object>> childList = this.mineList(sourceDir.getId());
                    Map<String, Object> subOprParams = new HashMap<>();
                    subOprParams.put("sourceList", childList);
                    subOprParams.put("toDirId", newDiskDir.getId());
                    subOprParams.put("oprType", "copy");
                    // 递归调用copy方法
                    this.oprBatch(subOprParams);
                }
            } else if (Type.FILE.equals(type)) {
                DiskFile sourceFile = diskFileBiz.getMapper().selectByPrimaryKey(id);

                if (toDirId == sourceFile.getDirId()) {
                    return;
                }

                // update dirId
                sourceFile.setDirId(toDirId);
                int count = diskFileBiz.checkSameNameCount(sourceFile);
                String oldName = sourceFile.getName();
                int addFlag = 1;
                while (count > 0) {
                    String newName = DiskFileBiz.fileNameAddSuffix(oldName, "(" + addFlag +")"); // 移动后文件新名称
                    sourceFile.setName(newName);
                    count = diskFileBiz.checkSameNameCount(sourceFile);
                    addFlag++;
                }

                if ("move".equals(oprType)) {
                    diskFileBiz.updateSelectiveById(sourceFile);
                } else if ("copy".equals(oprType)) {
                    DiskFile newDiskFile = new DiskFile();
                    newDiskFile.setDirId(toDirId);
                    newDiskFile.setName(sourceFile.getName());
                    newDiskFile.setSize(sourceFile.getSize());
                    newDiskFile.setType(sourceFile.getType());
                    newDiskFile.setUrl(sourceFile.getUrl());

                    diskFileBiz.insertSelective(newDiskFile);
                }

            }
        });
    }

}