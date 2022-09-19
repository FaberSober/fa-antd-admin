package com.faber.common.rest;

import com.faber.common.biz.BaseBiz;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.vo.Query;
import com.faber.common.utils.BaseResHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * <h3>通用Rest接口父类，包含基本的方法：</h3>
 * <ol>
 * <li>save - 新增</li>
 * <li>saveBatch - 新增批量</li>
 * <li>get - id查询</li>
 * <li>update - 更新</li>
 * <li>remove - id删除</li>
 * <li>removeBatchByIds - ids批量删除</li>
 * <li>all - 获取所有List</li>
 * <li>list - 获取List，带过滤查询条件</li>
 * <li>mineList - 获取List(限定登录用户创建)，带过滤查询条件</li>
 * <li>count - 过滤条件统计数量</li>
 * <li>page - 分页获取</li>
 * <li>exportExcel - 过滤条件导出Excel</li>
 * </ol>
 *
 * @param <Biz>    {@link BaseBiz}
 * @param <Entity>
 */
@Slf4j
public class BaseController<Biz extends BaseBiz, Entity, Key extends Serializable> extends BaseResHandler {

    @Autowired
    protected Biz baseBiz;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Entity> add(@Valid @RequestBody Entity entity) {
        baseBiz.save(entity);
        return ok(entity);
    }

    @RequestMapping(value = "/saveBatch", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<List<Entity>> saveBatch(@Valid @RequestBody List<Entity> entityList) {
        baseBiz.saveBatch(entityList);
        return ok(entityList);
    }

    @RequestMapping(value = "/get/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<Entity> get(@PathVariable Key id) {
        Entity o = (Entity) baseBiz.getById(id);
        return ok(o);
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Entity> update(@Valid @RequestBody Entity entity) {
        baseBiz.updateById(entity);
        return ok();
    }

    @RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ObjectRestResponse<Entity> remove(@PathVariable Key id) {
        baseBiz.removeById(id);
        return ok();
    }

    @RequestMapping(value = "/removeBatchByIds", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> removeBatchByIds(@RequestBody List<Serializable> ids) {
        baseBiz.removeBatchByIds(ids);
        return ok();
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<Entity>> all() {
        List<Entity> list = baseBiz.list();
        return ok(list);
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<List<Entity>> list(@RequestBody Map<String, Object> params) {
        List<Entity> list = baseBiz.list(params);
        return ok(list);
    }

    @RequestMapping(value = "/mineList", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<List<Entity>> mineList(@RequestParam Map<String, Object> params) {
        List<Entity> list = baseBiz.mineList(params);
        return ok(list);
    }

    @RequestMapping(value = "/count", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Long> count(@RequestParam Map<String, Object> params) {
        long count = baseBiz.count(baseBiz.parseQuery(new Query(params)));
        return ok(count);
    }

    /**
     * 分页查询
     */
    @RequestMapping(value = "/page", method = RequestMethod.POST)
    @ResponseBody
    public TableResultResponse<Entity> page(@RequestBody Map<String, Object> params) {
        Query query = new Query(params);
        return baseBiz.selectPageByQuery(query);
    }

    /**
     * 导出Excel[分页查询]
     */
    @RequestMapping(value = "/exportExcel", method = RequestMethod.POST)
    @ResponseBody
    public void exportExcel(@RequestBody Map<String, Object> params) throws IOException {
        baseBiz.exportExcel(params);
    }

}
