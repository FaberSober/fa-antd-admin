package com.faber.common.rest;

import com.faber.common.msg.TableResultResponse;
import com.faber.common.utils.BaseResHandler;
import com.faber.common.biz.BaseBiz;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.util.Query;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * <h3>通用Rest接口父类，包含基本的方法：</h3>
 * <ol>
 * <li>add - 新增</li>
 * <li>get - id查询</li>
 * <li>update - 更新</li>
 * <li>remove - id删除</li>
 * <li>logicDeleteById - id逻辑删除</li>
 * <li>batchDelete - ids批量删除</li>
 * <li>batchLogicDelete - ids批量逻辑删除</li>
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
public class BaseController<Biz extends BaseBiz, Entity> extends BaseResHandler {

    @Autowired
    protected HttpServletRequest request;

    @Autowired
    protected Biz baseBiz;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Entity> add(@Valid @RequestBody Entity entity) {
        baseBiz.insertSelective(entity);
        return ok(entity);
    }

    @RequestMapping(value = "/batchInsert", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<List<Entity>> batchInsert(@Valid @RequestBody List<Entity> entityList) {
        baseBiz.batchInsert(entityList);
        return ok(entityList);
    }

    @RequestMapping(value = "/get/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<Entity> get(@PathVariable Object id) {
        Entity o = (Entity) baseBiz.selectById(id);
        return ok(o);
    }

    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    @ResponseBody
    public ObjectRestResponse<Entity> update(@Valid @RequestBody Entity entity) {
        baseBiz.updateSelectiveById(entity);
        return ok();
    }

    /**
     * 更新给定的全部字段
     * @param entity
     * @return
     */
    @RequestMapping(value = "/updateAll", method = RequestMethod.PUT)
    @ResponseBody
    public ObjectRestResponse<Entity> updateAll(@Valid @RequestBody Entity entity) {
        baseBiz.updateById(entity);
        return ok();
    }

    /**
     * 只更新传入的参数
     * @param entity
     * @return
     */
    @RequestMapping(value = "/updateSelective", method = RequestMethod.PUT)
    @ResponseBody
    public ObjectRestResponse<Entity> updateSelective(@Valid @RequestBody Entity entity) {
        baseBiz.updateSelectiveById(entity);
        return ok();
    }

    @RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ObjectRestResponse<Entity> remove(@PathVariable Object id) {
        baseBiz.deleteById(id);
        return ok();
    }

    @RequestMapping(value = "/logicDeleteById/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ObjectRestResponse<Entity> logicDeleteById(@PathVariable Object id) {
        baseBiz.logicDeleteById(id);
        return ok();
    }

    /**
     * 批量删除
     */
    @RequestMapping(value = "/batchDelete", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse batchDelete(@RequestBody Map<String, Object> params) {
        baseBiz.batchDelete(params);
        return ok();
    }

    /**
     * 批量逻辑删除
     */
    @RequestMapping(value = "/batchLogicDelete", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse batchLogicDelete(@RequestBody Map<String, Object> params) {
        baseBiz.batchLogicDelete(params);
        return ok();
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<Entity>> all() {
        List<Entity> list = baseBiz.selectListAll();
        return ok(list);
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<List<Entity>> listV2(@RequestBody Map<String, Object> params) {
        Query query = new Query(params);
        List<Entity> list = baseBiz.selectByQuery(query);
        return ok(list);
    }

    @RequestMapping(value = "/mineList", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<Entity>> mineList(@RequestParam Map<String, Object> params) {
        List<Entity> list = baseBiz.mineList(params);
        return ok(list);
    }

    @RequestMapping(value = "/count", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<Integer> count(@RequestParam Map<String, Object> params) {
        int count = baseBiz.count(params);
        return ok(count);
    }

    /**
     * 分页查询
     */
    @RequestMapping(value = "/page", method = RequestMethod.POST)
    @ResponseBody
    public TableResultResponse<Entity> page(@RequestBody Map<String, Object> params) {
        //查询列表数据
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
