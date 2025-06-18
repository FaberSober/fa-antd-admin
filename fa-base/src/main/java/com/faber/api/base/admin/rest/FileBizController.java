package com.faber.api.base.admin.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.base.admin.biz.FileBizBiz;
import com.faber.api.base.admin.entity.FileBiz;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-通用业务附件表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-03-05 14:49:12
 */
@FaLogBiz("BASE-通用业务附件表")
@RestController
@RequestMapping("/api/base/admin/fileBiz")
public class FileBizController extends BaseController<FileBizBiz, FileBiz, Integer> {

}