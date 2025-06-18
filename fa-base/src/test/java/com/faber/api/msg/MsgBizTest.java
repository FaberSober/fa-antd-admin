package com.faber.api.msg;

import com.faber.api.base.msg.mapper.MsgMapper;
import com.faber.FaTestApp;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;


import jakarta.annotation.Resource;

@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MsgBizTest {

    @Resource
    MsgMapper msgMapper;

    @Test
    public void testDeletePermanentById() {
        msgMapper.deleteByIdIgnoreLogic(1L);
    }

    @Test
    public void testSelectByIdPure() {
        log.debug("----before deleted---->>>");
        log.debug("msg: {}", msgMapper.selectById(1L));
        log.debug("----logic deleted---->>>");
        msgMapper.deleteById(1L);
        log.debug("----after logic deleted---->>>");
        log.debug("msg: {}", msgMapper.selectById(1L));
        log.debug("msg: {}", msgMapper.selectByIdIgnoreLogic(1L));
    }

}
