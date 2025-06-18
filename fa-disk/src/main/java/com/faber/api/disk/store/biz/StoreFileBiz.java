package com.faber.api.disk.store.biz;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ZipUtil;
//import com.alicp.jetcache.anno.CacheInvalidate;
//import com.alicp.jetcache.anno.Cached;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.faber.api.base.admin.biz.FileSaveBiz;
import com.faber.api.base.admin.entity.FileSave;
import com.faber.api.disk.store.entity.StoreFile;
import com.faber.api.disk.store.entity.StoreFileTag;
import com.faber.api.disk.store.entity.StoreTag;
import com.faber.api.disk.store.mapper.StoreFileMapper;
import com.faber.api.disk.store.vo.req.StoreFileQueryVo;
import com.faber.api.disk.store.vo.req.StoreFilesAddTags;
import com.faber.api.disk.store.vo.req.StoreFilesMoveTo;
import com.faber.core.exception.BuzzException;
import com.faber.core.utils.FaFileUtils;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.BasePageQuery;
import com.faber.core.web.biz.BaseTreeBiz;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * STORE-文件
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-22 09:31:17
 */
@Service
public class StoreFileBiz extends BaseTreeBiz<StoreFileMapper, StoreFile> {

    public static final String ROOT_DIR_NAME = "全部文件";

    @Resource
    FileSaveBiz fileSaveBiz;

    @Resource
    StoreTagBiz storeTagBiz;

    @Resource
    StoreFileTagBiz storeFileTagBiz;

    @Resource
    StoreFileHisBiz storeFileHisBiz;

    @Override
    protected void enhanceTreeQuery(QueryWrapper<StoreFile> wrapper) {
        wrapper.eq("dir", true);
    }

//    @Cached(name = "store:file:fullpath:", key = "#id", expire = 3600)
    public List<StoreFile> getFullPath(Integer id) {
        return super.treePathLine(id);
    }

    public void syncFullPath(StoreFile entity) {
        StoreFile dirEntity = this.getById(entity.getParentId());
        if (dirEntity == null) {
            entity.setFullPath("#" + ROOT_DIR_NAME + "#");
        } else {
            entity.setFullPath(dirEntity.getFullPath() + ",#" + dirEntity.getName() + "#");
        }
    }

    public void syncDirSize(Integer dirId) {
        if (dirId == 0) return;
        long count = lambdaQuery()
                .eq(StoreFile::getParentId, dirId)
                .count();
        lambdaUpdate().eq(StoreFile::getId, dirId)
                .set(StoreFile::getSize, count)
                .update();
    }

    @Override
    public boolean save(StoreFile entity) {
        // store file
        if (!entity.getDir()) { // 文件类型，存储文件
            FileSave fileSave = fileSaveBiz.getById(entity.getFileId());

            entity.setName(fileSave.getOriginalFilename());
            entity.setSize(fileSave.getSize());
            entity.setType(FileUtil.extName(fileSave.getOriginalFilename()));

            // judge same name file
            long count = lambdaQuery()
                    .eq(StoreFile::getBucketId, entity.getBucketId())
                    .eq(StoreFile::getDir, false)
                    .eq(StoreFile::getParentId, entity.getParentId())
                    .eq(StoreFile::getName, entity.getName())
                    .count();
            if (count > 0) {
                String now = DateUtil.format(new Date(), "yyyyMMddHHmmss");
                entity.setName(FaFileUtils.addSuffixToFileName(fileSave.getOriginalFilename(), "_(" + count + ")_" + now));
            }
        } else { // 文件夹，保存文件夹
            // judge same name dir
            long count = lambdaQuery()
                    .eq(StoreFile::getBucketId, entity.getBucketId())
                    .eq(StoreFile::getDir, true)
                    .eq(StoreFile::getParentId, entity.getParentId())
                    .eq(StoreFile::getName, entity.getName())
                    .count();
            if (count > 0) throw new BuzzException("已经存在同名目录");
        }

        // update full path
        this.syncFullPath(entity);
        entity.setDeleteAction(false);

        super.save(entity);

        // update dir count
        this.syncDirSize(entity.getParentId());

        // 保持历史版本
        if (!entity.getDir()) {
            storeFileHisBiz.saveSnapshot(entity);
        }

        return true;
    }

//    @CacheInvalidate(name = "store:file:fullpath:", key = "#entity.id")
    @Override
    public boolean updateById(StoreFile entity) {
        long count = lambdaQuery()
                .eq(StoreFile::getBucketId, entity.getBucketId())
                .eq(StoreFile::getDir, entity.getDir())
                .eq(StoreFile::getParentId, entity.getParentId())
                .eq(StoreFile::getName, entity.getName())
                .ne(StoreFile::getId, entity.getId())
                .count();
        if (count > 0) throw new BuzzException("已经存在同名文件");

        return super.updateById(entity);
    }

    public void updateInfo(StoreFile entity) {
        super.updateById(entity);
    }

    public void updateInfoBatch(List<StoreFile> list) {
        for (StoreFile storeFile : list) {
            this.updateInfo(storeFile);
        }
    }

    public void loopDelete(List<StoreFile> list) {
        for (StoreFile item : list) {
            if (item.getDir()) {
                List<StoreFile> child = lambdaQuery().eq(StoreFile::getParentId, item.getId()).list();
                this.loopDelete(child);
            }
            baseMapper.deleteById(item.getId());
        }
    }

    @Override
    @Transactional
    public boolean removeById(Serializable id) {
        StoreFile file = baseMapper.selectById(id);

        // mark delete action
        lambdaUpdate().eq(StoreFile::getId, id).set(StoreFile::getDeleteAction, true).update();

        // 删除子元素
        List<StoreFile> child = lambdaQuery().eq(StoreFile::getParentId, id).list();
        loopDelete(child);

        super.removeById(id);

        // sync parent Dir size
        this.syncDirSize(file.getParentId());

        return true;
    }

    @Override
    @Transactional
    public boolean removeBatchByIds(Collection<?> list) {
        list.forEach(i -> {
            this.removeById((Serializable) i);
        });
        return true;
    }

    public void loopDeletePre(List<StoreFile> list) {
        for (StoreFile item : list) {
            if (item.getDir()) {
                List<StoreFile> child = baseMapper.queryChildren(item.getId());
                this.loopDelete(child);
            }
            baseMapper.deleteByIdIgnoreLogic(item.getId());
        }
    }

    @Override
    @Transactional
    public void removePerById(Serializable id) {
        // remove child item
        List<StoreFile> child = baseMapper.queryChildren((Integer) id);
        loopDeletePre(child);

        baseMapper.deleteByIdIgnoreLogic(id);
    }

    public void downloadZip(List<Integer> ids) throws IOException {
        List<StoreFile> list = lambdaQuery()
                .in(StoreFile::getId, ids)
                .orderByDesc(StoreFile::getDir)
                .orderByAsc(StoreFile::getName)
                .list();
        if (list == null || list.isEmpty()) throw new BuzzException("未找到文件，请确认");
        String firstName = list.get(0).getName();

        String now = DateUtil.format(new Date(), "yyyyMMddHHmmss");

        String zipFilePath = FaFileUtils.getAbsolutePath() + File.separator + "static"
                + File.separator + "zip"
                + File.separator + now
                + File.separator + firstName + "_" + System.currentTimeMillis();

        FileUtil.mkdir(zipFilePath);

        // loop set file
        this.addFiles(zipFilePath, list);

        // zip dir to file
        File zipFile = ZipUtil.zip(zipFilePath);

        FaFileUtils.downloadFile(zipFile);
    }

    public void addFiles(String rootDir, List<StoreFile> list) throws IOException {
        for (StoreFile storeFile : list) {
            if (storeFile.getDir()) {
                // create dir
                String dirPath = rootDir + File.separator + storeFile.getName();
                FileUtil.mkdir(dirPath);

                // query sub file
                List<StoreFile> subList = lambdaQuery()
                        .eq(StoreFile::getParentId, storeFile.getId())
                        .orderByDesc(StoreFile::getDir)
                        .orderByAsc(StoreFile::getName)
                        .list();

                this.addFiles(dirPath, subList);
            } else {
                File srcFile = fileSaveBiz.getFileObj(storeFile.getFileId());

                FileUtil.copyFile(srcFile, new File(rootDir));
                FileUtil.rename(new File(rootDir + File.separator + srcFile.getName()), storeFile.getName(), true);
            }
        }
    }

    public void moveToDir(StoreFilesMoveTo params) {
        for (Integer fileId : params.getFileIds()) {
            StoreFile storeFile = super.getById(fileId);
            storeFile.setParentId(params.getToDirId());
            this.updateById(storeFile);
        }

        this.syncDir(params.getToDirId());
    }

    public void copyToDir(StoreFilesMoveTo params) {
        for (Integer fileId : params.getFileIds()) {
            StoreFile storeFile = super.getById(fileId);
            Integer oldId = storeFile.getId();

            storeFile.setParentId(params.getToDirId());
            storeFile.setId(null);
            this.save(storeFile);

            // loop child files move to new copied dir
            if (storeFile.getDir()) {
                List<StoreFile> childItems = lambdaQuery().eq(StoreFile::getParentId, oldId).list();
                List<Integer> fileIds = childItems.stream().map(i -> i.getId()).collect(Collectors.toList());

                StoreFilesMoveTo moveChild = new StoreFilesMoveTo(fileIds, storeFile.getId());
                this.copyToDir(moveChild);
            }
        }

        this.syncDir(params.getToDirId());
    }

    public void syncFileTags(Integer fileId) {
        StoreFile.Tag[] tags = storeFileTagBiz.lambdaQuery()
                .eq(StoreFileTag::getFileId, fileId)
                .list()
                .stream().map(i -> {
                    StoreTag tag = storeTagBiz.getByIdWithCache(i.getTagId());
                    return new StoreFile.Tag(i.getId(), i.getTagId(), tag.getName(), tag.getColor());
                })
                .toArray(StoreFile.Tag[]::new);

        StoreFile storeFile = super.getById(fileId);
        storeFile.setTags(tags);
        super.updateById(storeFile);
    }

    public void addTags(StoreFilesAddTags params) {
        for (Integer fileId : params.getFileIds()) {
            for (Integer tagId : params.getTagIds()) {
                long count = storeFileTagBiz.lambdaQuery()
                        .eq(StoreFileTag::getFileId, fileId)
                        .eq(StoreFileTag::getTagId, tagId)
                        .count();
                if (count == 1) continue; // no need to operate

                // remove pre tagLink
                if (count > 0) {
                    storeFileTagBiz.lambdaUpdate()
                            .eq(StoreFileTag::getFileId, fileId)
                            .eq(StoreFileTag::getTagId, tagId)
                            .remove();
                }

                // add new Tag Link
                StoreFileTag fileTag = new StoreFileTag();
                fileTag.setFileId(fileId);
                fileTag.setTagId(tagId);
                storeFileTagBiz.save(fileTag);
            }

            this.syncFileTags(fileId);
        }
    }

    public void syncDir(Integer dirId) {
        List<StoreFile> dirs = this.getFullPath(dirId);
        List<String> dirNames = dirs.stream().map(i -> i.getName()).collect(Collectors.toList());
        dirNames.add(0, ROOT_DIR_NAME);
        String fullPath = ArrayUtil.join(dirNames.toArray(), ",", "#", "#");

        List<StoreFile> list = lambdaQuery().eq(StoreFile::getParentId, dirId).list();
        for (StoreFile item : list) {
            item.setFullPath(fullPath);
            this.updateById(item);

            if (item.getDir()) {
                this.syncDir(item.getId());
            }
        }
    }

    public List<StoreFile> queryFile(BasePageQuery<StoreFileQueryVo> query) {
        query.getQuery().setDeleted(false);
        return baseMapper.queryFile(query.getQuery(), query.getSorter());
    }

    public TableRet<StoreFile> queryFilePage(BasePageQuery<StoreFileQueryVo> query) {
        query.getQuery().setDeleted(false);
        PageInfo<StoreFile> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
                .doSelectPageInfo(() -> baseMapper.queryFile(query.getQuery(), query.getSorter()));
        return new TableRet<>(info);
    }

    public TableRet<StoreFile> queryTrashFilePage(BasePageQuery<StoreFileQueryVo> query) {
        query.getQuery().setDeleted(true);
        PageInfo<StoreFile> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
                .doSelectPageInfo(() -> baseMapper.queryFile(query.getQuery(), query.getSorter()));
        return new TableRet<>(info);
    }

    public void loopPutBack(List<StoreFile> list, Integer toDirId) {
        for (StoreFile item : list) {
            // put file back
            this.putFileBack(item, toDirId);

            if (item.getDir()) {
                List<StoreFile> child = baseMapper.queryChildren(item.getId());
                loopPutBack(child, item.getId());
            }
        }
        this.syncDirSize(toDirId);
    }

    @Transactional
    public void putBack(List<Integer> ids) {
        for (Integer id : ids) {
            // put file back
            StoreFile file = baseMapper.selectById(id);
            this.putFileBack(file, file.getParentId());

            // loop children put back
            List<StoreFile> child = baseMapper.queryChildren(id);
            loopPutBack(child, file.getId());

            this.syncDirSize(file.getParentId());
        }
    }

    @Transactional
    public void putBackToDir(StoreFilesMoveTo params) {
        for (Integer id : params.getFileIds()) {
            // put file back
            StoreFile file = baseMapper.selectById(id);
            this.putFileBack(file, params.getToDirId());

            // loop children put back
            List<StoreFile> child = baseMapper.queryChildren(id);
            loopPutBack(child, file.getId());

            this.syncDirSize(params.getToDirId());
        }
    }

    public void putFileBack(StoreFile file, Integer toDirId) {
        // check toDirId exists
        String fullPath = ROOT_DIR_NAME;
        if (toDirId > 0) {
            StoreFile parentDir = baseMapper.selectById(toDirId);
            fullPath = parentDir.getFullPath();
            if (parentDir == null || !parentDir.getDir()) {
                throw new BuzzException("目标文件夹不存在，请确认");
            }
        }

        // check file name single
        long count = lambdaQuery()
                .eq(StoreFile::getBucketId, file.getBucketId())
                .eq(StoreFile::getDir, file.getDir())
                .eq(StoreFile::getParentId, toDirId)
                .eq(StoreFile::getName, file.getName())
                .ne(StoreFile::getId, file.getId())
                .count();
        if (count > 0) {
            throw new BuzzException("目标文件夹[" + fullPath + "]存在相同文件[" + file.getName() + "]");
        }

        // put file back
        baseMapper.putFileTo(file.getId(), toDirId);

        this.syncFullPath(file);
        lambdaUpdate().eq(StoreFile::getId, file.getId())
                .set(StoreFile::getFullPath, file.getFullPath())
                .update();
    }

}