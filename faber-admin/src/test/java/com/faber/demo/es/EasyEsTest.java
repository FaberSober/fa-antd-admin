package com.faber.demo.es;

import cn.easyes.core.conditions.LambdaEsQueryWrapper;
import com.faber.AdminBootstrap;
import com.faber.api.base.demo.es.Document;
import com.faber.api.base.demo.esmapper.DocumentMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/12 17:39
 */
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class EasyEsTest {

    @Resource
    DocumentMapper documentMapper;

    @Test
    public void testInsert() {
        // 初始化-> 新增数据
        Document document = new Document();
        document.setTitle("springboot");
        document.setContent("单体服务开发");
        Integer result = documentMapper.insert(document);
        log.info("result: {}", result);
    }

    @Test
    public void testSearchEq() {
        // 查询出所有标题为老汉的文档列表
        LambdaEsQueryWrapper<Document> wrapper = new LambdaEsQueryWrapper<>();
        wrapper.eq(Document::getTitle, "springboot");
        List<Document> list = documentMapper.selectList(wrapper);
        log.info("list: {}", list);
    }

    @Test
    public void testSearchLike() {
        // 查询出所有标题为老汉的文档列表
        LambdaEsQueryWrapper<Document> wrapper = new LambdaEsQueryWrapper<>();
        wrapper.like(Document::getTitle, "spring");
        List<Document> list = documentMapper.selectList(wrapper);
        log.info("list: {}", list);
    }

}
