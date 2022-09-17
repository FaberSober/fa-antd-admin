package com.faber.admin.mapper;

import com.faber.admin.entity.Job;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

/**
 * 系统定时任务
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-21 14:48:06
 */
// @Mapper
public interface JobMapper extends BaseMapper<Job> {

    List<Job> selectStartUpJobs();
	
}
