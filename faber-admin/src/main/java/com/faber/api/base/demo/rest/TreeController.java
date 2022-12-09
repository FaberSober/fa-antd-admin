package com.faber.api.base.demo.rest;

import com.faber.api.base.demo.entity.Tree;
import com.faber.api.base.demo.biz.TreeBiz;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/base/demo/tree")
public class TreeController extends BaseTreeController<TreeBiz, Tree, Integer> {

}
