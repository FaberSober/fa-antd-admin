package com.faber.msg;

import com.faber.AdminBootstrap;
import com.faber.api.base.msg.mapper.MsgMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MsgBizTest {

    @Resource
    MsgMapper msgMapper;

    @Test
    public void testDeletePermanentById() {
        msgMapper.deletePermanentById(1L);
    }

    @Test
    public void testSelectByIdPure() {
        log.debug("----before deleted---->>>");
        log.debug("msg: {}", msgMapper.selectById(1L));
        log.debug("----logic deleted---->>>");
        msgMapper.deleteById(1L);
        log.debug("----after logic deleted---->>>");
        log.debug("msg: {}", msgMapper.selectById(1L));
        log.debug("msg: {}", msgMapper.selectByIdPure(1L));
    }

}
