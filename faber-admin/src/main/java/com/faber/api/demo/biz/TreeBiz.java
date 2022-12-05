package com.faber.api.demo.biz;

import com.faber.api.demo.entity.Tree;
import com.faber.api.demo.mapper.TreeMapper;
import com.faber.core.web.biz.BaseTreeBiz;
import org.springframework.stereotype.Service;

/**
 * DEMO-tree数据
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2022/11/30 18:29
 */
@Service
public class TreeBiz extends BaseTreeBiz<TreeMapper, Tree> {

}
