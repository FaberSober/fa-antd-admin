package com.faber.admin.rest;

import com.faber.admin.biz.MenuBlockBiz;
import com.faber.admin.entity.MenuBlock;
import com.faber.common.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/menuBlock")
public class MenuBlockController extends BaseController<MenuBlockBiz, MenuBlock> {

}