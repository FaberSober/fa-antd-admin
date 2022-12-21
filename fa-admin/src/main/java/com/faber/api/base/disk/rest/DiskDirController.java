package com.faber.api.base.disk.rest;

import com.faber.api.base.disk.biz.DiskDirBiz;
import com.faber.api.base.disk.entity.DiskDir;
import com.faber.api.base.disk.vo.DiskDirVO;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/base/disk/dir")
public class DiskDirController extends BaseTreeController<DiskDirBiz, DiskDir, Integer> {

    /**
     * 更新文件夹名称
     */
    @RequestMapping(value = "/updateName", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateName(@RequestBody Map<String, Object> params) {
        baseBiz.updateName(params);
        return ok();
    }

    /**
     * 根据路径string获取目录List
     * @param path 目录路径，如：/path1/path2
     * @return
     */
    @RequestMapping(value = "/mine/listByPath", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<DiskDir>> mineListByPath(@RequestParam String path) {
        List<DiskDir> data = baseBiz.mineListByPath(path);
        return ok(data);
    }

    /**
     * 获取当前登录用户的下级目录文件夹&文件List
     * @param dir 文件夹ID
     * @return
     */
    @RequestMapping(value = "/mine/list", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Object> mineList(@RequestParam int dir) {
        List<Map<String, Object>> list = baseBiz.mineFileList(dir);
        return ok(list);
    }

    /**
     * 展示下级目录List
     * @param parentId 文件夹ID
     * @return
     */
    @RequestMapping(value = "/listSub", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<DiskDirVO>> listSub(@RequestParam int parentId) {
        List<DiskDirVO> list = baseBiz.listSub(parentId);
        return ok(list);
    }

    /**
     * [移动、复制][文件、文件夹]到目标路径
     */
    @RequestMapping(value = "/oprBatch", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> oprBatch(@RequestBody Map<String, Object> params) {
        baseBiz.oprBatch(params);
        return ok();
    }

}