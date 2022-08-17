package com.faber.admin.mapper;

import com.faber.admin.entity.Job;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

/**
 * 系统定时任务
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-21 14:48:06
 */
// @Mapper
public interface JobMapper extends Mapper<Job> {

    List<Job> selectStartUpJobs();
	
}
