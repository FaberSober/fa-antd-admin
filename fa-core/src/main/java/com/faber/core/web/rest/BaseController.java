package com.faber.core.web.rest;

import com.faber.core.annotation.FaLogOpr;
import com.faber.core.annotation.LogNoRet;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.excel.CommonImportExcelReqVo;
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
import java.util.Map;

/**
 * <h3>通用Rest接口父类，包含基本的方法：</h3>
 *
 * <table>
 *     <thead><tr><td>方法</td><td>说明</td></tr></thead>
 *     <tbody>
 *         <tr><td>{@link BaseController#save}</td>                 <td>新增</td></tr>
 *         <tr><td>{@link BaseController#saveBatch}</td>            <td>新增批量</td></tr>
 *         <tr><td>{@link BaseController#getById}</td>              <td>id查询</td></tr>
 *         <tr><td>{@link BaseController#getDetail}</td>            <td>id查询详情</td></tr>
 *         <tr><td>{@link BaseController#getByIds}</td>             <td>ids集合查询</td></tr>
 *         <tr><td>{@link BaseController#update}</td>               <td>更新</td></tr>
 *         <tr><td>{@link BaseController#updateBatch}</td>          <td>批量更新</td></tr>
 *         <tr><td>{@link BaseController#saveOrUpdate}</td>         <td>新增or更新</td></tr>
 *         <tr><td>{@link BaseController#saveOrUpdateBatch}</td>    <td>批量新增or更新</td></tr>
 *         <tr><td>{@link BaseController#remove}</td>               <td>id删除</td></tr>
 *         <tr><td>{@link BaseController#removeBatchByIds}</td>     <td>ids批量删除</td></tr>
 *         <tr><td>{@link BaseController#removePer}</td>            <td>id永久删除</td></tr>
 *         <tr><td>{@link BaseController#removePerBatchByIds}</td>  <td>ids批量永久删除</td></tr>
 *         <tr><td>{@link BaseController#removeByQuery}</td>        <td>通过查询条件删除</td></tr>
 *         <tr><td>{@link BaseController#removeMine}</td>           <td>删除当前用户的数据</td></tr>
 *         <tr><td>{@link BaseController#removeMineByQuery}</td>    <td>限定当前用户通过查询条件删除</td></tr>
 *         <tr><td>{@link BaseController#all}</td>                  <td>获取所有List</td></tr>
 *         <tr><td>{@link BaseController#list}</td>                 <td>获取List，带过滤查询条件</td></tr>
 *         <tr><td>{@link BaseController#listN}</td>                <td>获取第N个，带过滤查询条件</td></tr>
 *         <tr><td>{@link BaseController#mineList}</td>             <td>获取List(限定登录用户创建)，带过滤查询条件</td></tr>
 *         <tr><td>{@link BaseController#count}</td>                <td>过滤条件统计数量</td></tr>
 *         <tr><td>{@link BaseController#page}</td>                 <td>分页获取</td></tr>
 *         <tr><td>{@link BaseController#minePage}</td>             <td>个人分页查询</td></tr>
 *         <tr><td>{@link BaseController#exportExcel}</td>          <td>过滤条件导出Excel</td></tr>
 *         <tr><td>{@link BaseController#exportTplExcel}</td>       <td>下载导入Excel模版</td></tr>
 *         <tr><td>{@link BaseController#importExcel}</td>          <td>导入Excel数据</td></tr>
 *     </tbody>
 * </table>
 *
 * @author xupengfei
 * @param <Biz>    {@link BaseBiz}
 * @param <Entity>
 */
@Slf4j
public abstract class BaseController<Biz extends BaseBiz, Entity, Key extends Serializable> extends BaseResHandler {

    @Autowired
    protected Biz baseBiz;

    @FaLogOpr(value = "新增", crud = LogCrudEnum.C)
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Entity> save(@Validated(value = Vg.Crud.C.class) @RequestBody Entity entity) {
        baseBiz.save(entity);
        return ok(entity);
    }

    @FaLogOpr(value = "批量新增", crud = LogCrudEnum.C)
    @RequestMapping(value = "/saveBatch", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<Entity>> saveBatch(@Validated(value = Vg.Crud.C.class) @RequestBody List<Entity> entityList) {
        baseBiz.saveBatch(entityList);
        return ok(entityList);
    }

    @FaLogOpr(value = "id查询", crud = LogCrudEnum.R)
    @RequestMapping(value = "/getById/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Entity> getById(@PathVariable Key id) {
        Entity o = (Entity) baseBiz.getById(id);
        return ok(o);
    }

    @FaLogOpr(value = "查询详情", crud = LogCrudEnum.R)
    @RequestMapping(value = "/getDetail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Entity> getDetail(@PathVariable Key id) {
        Entity o = (Entity) baseBiz.getDetailById(id);
        return ok(o);
    }

    @FaLogOpr(value = "批量查询", crud = LogCrudEnum.R)
    @RequestMapping(value = "/getByIds", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<Entity>> getByIds(@RequestBody List<Key> ids) {
        List<Entity> o = baseBiz.getByIds(ids);
        return ok(o);
    }

    @FaLogOpr(value = "更新", crud = LogCrudEnum.U)
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Entity> update(@Validated(value = Vg.Crud.U.class) @RequestBody Entity entity) {
        baseBiz.updateById(entity);
        return ok();
    }

    @FaLogOpr(value = "批量更新", crud = LogCrudEnum.U)
    @RequestMapping(value = "/updateBatch", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateBatch(@Validated(value = Vg.Crud.U.class) @RequestBody List<Entity> entityList) {
        baseBiz.updateBatchById(entityList);
        return ok();
    }

    @FaLogOpr(value = "保存", crud = LogCrudEnum.C)
    @RequestMapping(value = "/saveOrUpdate", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Entity> saveOrUpdate(@RequestBody Entity entity) {
        baseBiz.saveOrUpdate(entity);
        return ok();
    }

    @FaLogOpr(value = "批量保存", crud = LogCrudEnum.C)
    @RequestMapping(value = "/saveOrUpdateBatch", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Entity> saveOrUpdateBatch(@RequestBody List<Entity> entityList) {
        baseBiz.saveOrUpdateBatch(entityList);
        return ok();
    }

    @FaLogOpr(value = "删除", crud = LogCrudEnum.D)
    @RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public Ret<Entity> remove(@PathVariable Key id) {
        baseBiz.removeById(id);
        return ok();
    }

    @FaLogOpr(value = "批量删除", crud = LogCrudEnum.D)
    @RequestMapping(value = "/removeBatchByIds", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> removeBatchByIds(@RequestBody List<Key> ids) {
        baseBiz.removeBatchByIds(ids);
        return ok();
    }

    @FaLogOpr(value = "永久删除", crud = LogCrudEnum.D)
    @RequestMapping(value = "/removePer/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public Ret<Entity> removePer(@PathVariable Key id) {
        baseBiz.removePerById(id);
        return ok();
    }

    @FaLogOpr(value = "批量永久删除", crud = LogCrudEnum.D)
    @RequestMapping(value = "/removePerBatchByIds", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> removePerBatchByIds(@RequestBody List<Key> ids) {
        baseBiz.removePerBatchByIds(ids);
        return ok();
    }

    @FaLogOpr(value = "通过查询条件删除", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/removeByQuery", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> removeByQuery(@RequestBody QueryParams query) {
        baseBiz.removeByQuery(query);
        return ok();
    }

    @FaLogOpr(value = "删除本用户数据", crud = LogCrudEnum.D)
    @RequestMapping(value = "/removeMine", method = RequestMethod.DELETE)
    @ResponseBody
    public Ret<Entity> removeMine() {
        baseBiz.removeMine();
        return ok();
    }

    @FaLogOpr(value = "限定当前用户通过查询条件删除", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/removeMineByQuery", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> removeMineByQuery(@RequestBody QueryParams query) {
        query.getQuery().put("crtUser", getCurrentUserId());
        baseBiz.removeByQuery(query);
        return ok();
    }

    @FaLogOpr(value = "全部获取", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/all", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<Entity>> all() {
        List<Entity> list = baseBiz.list();
        return ok(list);
    }

    @FaLogOpr(value = "列表获取", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<Entity>> list(@RequestBody QueryParams query) {
        List<Entity> list = baseBiz.list(query);
        return ok(list);
    }

    @FaLogOpr(value = "列表获取", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/listN", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<Entity>> listN(@RequestParam("topN") Integer topN, @RequestBody QueryParams query) {
        List<Entity> list = baseBiz.listN(query, topN);
        return ok(list);
    }

    @FaLogOpr(value = "个人列表", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/mineList", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<Entity>> mineList(@RequestBody QueryParams query) {
        List<Entity> list = baseBiz.mineList(query);
        return ok(list);
    }

    @FaLogOpr(value = "计数", crud = LogCrudEnum.R)
    @RequestMapping(value = "/count", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Long> count(@RequestBody QueryParams query) {
        long count = baseBiz.count(baseBiz.parseQuery(query));
        return ok(count);
    }

    @FaLogOpr(value = "分页查询", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/page", method = RequestMethod.POST)
    @ResponseBody
    public TableRet<Entity> page(@RequestBody QueryParams query) {
        return baseBiz.selectPageByQuery(query);
    }

    @FaLogOpr(value = "个人分页查询", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/minePage", method = RequestMethod.POST)
    @ResponseBody
    public TableRet<Entity> minePage(@RequestBody QueryParams query) {
        query.getQuery().put("crtUser", getLoginUserId());
        return baseBiz.selectPageByQuery(query);
    }

    @FaLogOpr(value = "导出Excel", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/exportExcel", method = RequestMethod.POST)
    @ResponseBody
    public void exportExcel(@RequestBody QueryParams query) throws IOException {
        baseBiz.exportExcel(query);
    }

    @FaLogOpr(value = "下载导入Excel模版", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/exportTplExcel", method = RequestMethod.POST)
    @ResponseBody
    public void exportTplExcel() throws IOException {
        baseBiz.exportTplExcel();
    }

    @FaLogOpr(value = "导入Excel数据", crud = LogCrudEnum.R)
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> importExcel(@RequestBody Map<String, Object> params) {
        CommonImportExcelReqVo reqVo = new CommonImportExcelReqVo(params);
        baseBiz.importExcel(reqVo);
        return ok();
    }

}
