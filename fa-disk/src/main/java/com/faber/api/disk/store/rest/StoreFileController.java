package com.faber.api.disk.store.rest;

import com.faber.api.disk.store.biz.StoreFileBiz;
import com.faber.api.disk.store.entity.StoreFile;
import com.faber.api.disk.store.vo.req.StoreFileQueryVo;
import com.faber.api.disk.store.vo.req.StoreFilesAddTags;
import com.faber.api.disk.store.vo.req.StoreFilesMoveTo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.annotation.LogNoRet;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.BasePageQuery;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * STORE-文件
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-22 09:31:17
 */
@FaLogBiz("网盘/文件")
@RestController
@RequestMapping("/api/disk/store/file")
public class StoreFileController extends BaseTreeController<StoreFileBiz, StoreFile, Integer> {

    @FaLogOpr(value = "批量下载", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/downloadZip", method = RequestMethod.POST)
    @ResponseBody
    public void downloadZip(@RequestBody List<Integer> ids) throws IOException {
        baseBiz.downloadZip(ids);
    }

    @FaLogOpr(value = "移动到", crud = LogCrudEnum.U)
    @RequestMapping(value = "/moveToDir", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> moveToDir(@RequestBody StoreFilesMoveTo params) {
        baseBiz.moveToDir(params);
        return ok();
    }

    @FaLogOpr(value = "复制到", crud = LogCrudEnum.U)
    @RequestMapping(value = "/copyToDir", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> copyToDir(@RequestBody StoreFilesMoveTo params) {
        baseBiz.copyToDir(params);
        return ok();
    }

    @FaLogOpr(value = "打标签", crud = LogCrudEnum.U)
    @RequestMapping(value = "/addTags", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> addTags(@RequestBody StoreFilesAddTags params) {
        baseBiz.addTags(params);
        return ok();
    }

    @FaLogOpr(value = "同步目录", crud = LogCrudEnum.U)
    @RequestMapping(value = "/syncDir", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Boolean> syncDir(@RequestParam("dirId") Integer dirId) {
        baseBiz.syncDir(dirId);
        return ok();
    }

    @FaLogOpr(value = "检索文件", crud = LogCrudEnum.R)
    @RequestMapping(value = "/queryFile", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<StoreFile>> queryFile(@RequestBody BasePageQuery<StoreFileQueryVo> params) {
        List<StoreFile> list = baseBiz.queryFile(params);
        return ok(list);
    }

    @FaLogOpr(value = "检索文件分页", crud = LogCrudEnum.R)
    @RequestMapping(value = "/queryFilePage", method = RequestMethod.POST)
    @ResponseBody
    public TableRet<StoreFile> queryFilePage(@RequestBody BasePageQuery<StoreFileQueryVo> params) {
        return baseBiz.queryFilePage(params);
    }

    @FaLogOpr(value = "检索回收站文件分页", crud = LogCrudEnum.R)
    @RequestMapping(value = "/queryTrashFilePage", method = RequestMethod.POST)
    @ResponseBody
    public TableRet<StoreFile> queryTrashFilePage(@RequestBody BasePageQuery<StoreFileQueryVo> params) {
        return baseBiz.queryTrashFilePage(params);
    }

    @FaLogOpr(value = "恢复到原处", crud = LogCrudEnum.U)
    @RequestMapping(value = "/putBack", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> putBack(@RequestBody List<Integer> ids) {
        baseBiz.putBack(ids);
        return ok();
    }

    @FaLogOpr(value = "恢复到", crud = LogCrudEnum.U)
    @RequestMapping(value = "/putBackToDir", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> putBackToDir(@RequestBody StoreFilesMoveTo params) {
        baseBiz.putBackToDir(params);
        return ok();
    }

    @FaLogOpr(value = "更新备注", crud = LogCrudEnum.U)
    @RequestMapping(value = "/updateInfo", method = RequestMethod.POST)
    @ResponseBody
    public Ret<StoreFile> updateInfo(@RequestBody StoreFile entity) {
        baseBiz.updateInfo(entity);
        return ok();
    }

    @FaLogOpr(value = "批量更新备注", crud = LogCrudEnum.U)
    @RequestMapping(value = "/updateInfoBatch", method = RequestMethod.POST)
    @ResponseBody
    public Ret<StoreFile> updateInfoBatch(@RequestBody List<StoreFile> list) {
        baseBiz.updateInfoBatch(list);
        return ok();
    }

}