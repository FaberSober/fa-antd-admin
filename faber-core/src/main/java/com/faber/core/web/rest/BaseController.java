package com.faber.core.web.rest;

import com.faber.core.annotation.FaLogOpr;
import com.faber.core.annotation.LogNoRet;
import com.faber.core.web.biz.BaseBiz;
import com.faber.core.vo.msg.Ret;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.config.validator.validator.Vg;
import com.faber.core.vo.query.QueryParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.Serializable;
import java.util.List;

/**
 * <h3>通用Rest接口父类，包含基本的方法：</h3>
 *
 * <table>
 *     <thead><tr><td>方法</td><td>说明</td></tr></thead>
 *     <tbody>
 *         <tr><td>{@link BaseController#save}</td>                 <td>新增</td></tr>
 *         <tr><td>{@link BaseController#saveBatch}</td>            <td>新增批量</td></tr>
 *         <tr><td>{@link BaseController#getById}</td>              <td>id查询</td></tr>
 *         <tr><td>{@link BaseController#getByIds}</td>             <td>ids集合查询</td></tr>
 *         <tr><td>{@link BaseController#update}</td>               <td>更新</td></tr>
 *         <tr><td>{@link BaseController#updateBatch}</td>          <td>批量更新</td></tr>
 *         <tr><td>{@link BaseController#saveOrUpdate}</td>         <td>新增or更新</td></tr>
 *         <tr><td>{@link BaseController#saveOrUpdateBatch}</td>    <td>批量新增or更新</td></tr>
 *         <tr><td>{@link BaseController#remove}</td>               <td>id删除</td></tr>
 *         <tr><td>{@link BaseController#removeBatchByIds}</td>     <td>ids批量删除</td></tr>
 *         <tr><td>{@link BaseController#all}</td>                  <td>获取所有List</td></tr>
 *         <tr><td>{@link BaseController#list}</td>                 <td>获取List，带过滤查询条件</td></tr>
 *         <tr><td>{@link BaseController#mineList}</td>             <td>获取List(限定登录用户创建)，带过滤查询条件</td></tr>
 *         <tr><td>{@link BaseController#count}</td>                <td>过滤条件统计数量</td></tr>
 *         <tr><td>{@link BaseController#page}</td>                 <td>分页获取</td></tr>
 *         <tr><td>{@link BaseController#exportExcel}</td>          <td>过滤条件导出Excel</td></tr>
 *     </tbody>
 * </table>
 *
 * @author xupengfei
 * @param <Biz>    {@link BaseBiz}
 * @param <Entity>
 */
@Slf4j
public class BaseController<Biz extends BaseBiz, Entity, Key extends Serializable> extends BaseResHandler {

    @Autowired
    protected Biz baseBiz;

    @FaLogOpr("新增")
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Entity> save(@Validated(value = Vg.Crud.C.class) @RequestBody Entity entity) {
        baseBiz.save(entity);
        return ok(entity);
    }

    @FaLogOpr("批量新增")
    @RequestMapping(value = "/saveBatch", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<Entity>> saveBatch(@Validated(value = Vg.Crud.C.class) @RequestBody List<Entity> entityList) {
        baseBiz.saveBatch(entityList);
        return ok(entityList);
    }

    @FaLogOpr("查询")
    @RequestMapping(value = "/getById/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Entity> getById(@PathVariable Key id) {
        Entity o = (Entity) baseBiz.getById(id);
        return ok(o);
    }

    @FaLogOpr("批量查询")
    @RequestMapping(value = "/getByIds", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<Entity>> getByIds(@RequestBody List<Key> ids) {
        List<Entity> o = baseBiz.getByIds(ids);
        return ok(o);
    }

    @FaLogOpr("更新")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Entity> update(@Validated(value = Vg.Crud.U.class) @RequestBody Entity entity) {
        baseBiz.updateById(entity);
        return ok();
    }

    @FaLogOpr("批量更新")
    @RequestMapping(value = "/updateBatch", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateBatch(@Validated(value = Vg.Crud.U.class) @RequestBody List<Entity> entityList) {
        baseBiz.updateBatchById(entityList);
        return ok();
    }

    @FaLogOpr("保存")
    @RequestMapping(value = "/saveOrUpdate", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Entity> saveOrUpdate(@RequestBody Entity entity) {
        baseBiz.saveOrUpdate(entity);
        return ok();
    }

    @FaLogOpr("批量保存")
    @RequestMapping(value = "/saveOrUpdateBatch", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Entity> saveOrUpdateBatch(@RequestBody List<Entity> entityList) {
        baseBiz.saveOrUpdateBatch(entityList);
        return ok();
    }

    @FaLogOpr("删除")
    @RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public Ret<Entity> remove(@PathVariable Key id) {
        baseBiz.removeById(id);
        return ok();
    }

    @FaLogOpr("批量删除")
    @RequestMapping(value = "/removeBatchByIds", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> removeBatchByIds(@RequestBody List<Key> ids) {
        baseBiz.removeBatchByIds(ids);
        return ok();
    }

    @FaLogOpr("全部获取")
    @LogNoRet
    @RequestMapping(value = "/all", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<Entity>> all() {
        List<Entity> list = baseBiz.list();
        return ok(list);
    }

    @FaLogOpr("列表获取")
    @LogNoRet
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<Entity>> list(@RequestBody QueryParams query) {
        List<Entity> list = baseBiz.list(query);
        return ok(list);
    }

    @FaLogOpr("个人列表")
    @LogNoRet
    @RequestMapping(value = "/mineList", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<Entity>> mineList(@RequestParam QueryParams query) {
        List<Entity> list = baseBiz.mineList(query);
        return ok(list);
    }

    @FaLogOpr("计数")
    @RequestMapping(value = "/count", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Long> count(@RequestBody QueryParams query) {
        long count = baseBiz.count(baseBiz.parseQuery(query));
        return ok(count);
    }

    @FaLogOpr("分页查询")
    @LogNoRet
    @RequestMapping(value = "/page", method = RequestMethod.POST)
    @ResponseBody
    public TableRet<Entity> page(@RequestBody QueryParams query) {
        return baseBiz.selectPageByQuery(query);
    }

    @FaLogOpr("导出Excel")
    @LogNoRet
    @RequestMapping(value = "/exportExcel", method = RequestMethod.POST)
    @ResponseBody
    public void exportExcel(@RequestBody QueryParams query) throws IOException {
        baseBiz.exportExcel(query);
    }

}
