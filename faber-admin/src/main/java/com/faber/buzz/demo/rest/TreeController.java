package com.faber.buzz.demo.rest;

import com.faber.buzz.demo.biz.TreeBiz;
import com.faber.buzz.demo.entity.Tree;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/demo/tree")
public class TreeController extends BaseTreeController<TreeBiz, Tree, Integer> {

}
