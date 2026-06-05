package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.RedisBiz;
import com.faber.api.base.admin.vo.ret.RedisKeyDetailVo;
import com.faber.api.base.admin.vo.ret.RedisKeyListVo;
import com.faber.api.base.admin.vo.ret.RedisOverviewVo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@FaLogBiz("Redis")
@RestController
@RequestMapping("/api/base/admin/redis")
public class RedisController extends BaseResHandler {

    @Resource
    private RedisBiz redisBiz;

    @FaLogOpr("Redis概览")
    @GetMapping("/overview")
    public Ret<RedisOverviewVo> overview() {
        return ok(redisBiz.overview());
    }

    @FaLogOpr("Redis键列表")
    @GetMapping("/listKeys")
    public Ret<RedisKeyListVo> listKeys(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "300") Integer limit
    ) {
        return ok(redisBiz.listKeys(keyword, limit));
    }

    @FaLogOpr("Redis键详情")
    @GetMapping("/detail")
    public Ret<RedisKeyDetailVo> detail(@RequestParam String key) {
        return ok(redisBiz.detail(key));
    }

    @FaLogOpr(value = "删除Redis键", crud = LogCrudEnum.D)
    @DeleteMapping("/delete")
    public Ret<Boolean> delete(@RequestParam String key) {
        return ok(redisBiz.delete(key));
    }

    @FaLogOpr(value = "批量删除Redis键", crud = LogCrudEnum.D)
    @PostMapping("/batchDelete")
    public Ret<Long> batchDelete(@RequestBody Map<String, List<String>> params) {
        return ok(redisBiz.batchDelete(params.get("keys")));
    }
}
