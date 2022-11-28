package com.faber.common.file.impl;

import cn.hutool.core.date.DateUtil;
import cn.hutool.extra.spring.SpringUtil;
import com.faber.common.constant.FaSetting;
import com.faber.common.exception.BuzzException;
import com.faber.common.file.FileHelperImpl;
import com.faber.common.utils.FaFileUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;

@Slf4j
@Service
@ConditionalOnProperty(name = "fa.setting.file.saveType", havingValue = "local")
public class FileHelperLocal implements FileHelperImpl {

    @Resource
    private FaSetting faSetting;

    @Override
    public String upload(InputStream is, String dir, String fileName) throws IOException {
        String fileSavePath = getDirPath() + dir + "/" + DateUtil.today() + "/" + FaFileUtils.addTimestampToFileName(fileName);

        File exportFile = new File(getAbsolutePath(), fileSavePath);
        FileUtils.copyInputStreamToFile(is, exportFile);

        return fileSavePath;
    }

    @Override
    public void delete(String filePath) throws IOException {
        File file = new File(getAbsolutePath(), filePath);
        if (file.exists()) {
            file.delete();
        }
    }

    private static String getAbsolutePath() throws IOException {
        // 开发环境获取编译class路径
        if ("dev".equals(SpringUtil.getActiveProfile())) {
            File path = new File(ResourceUtils.getURL("classpath:").getPath());
            if(!path.exists()) path = new File("");
            return path.getAbsolutePath() + "/static";
        }

        // 执行jar的环境获取jar的路径
        ApplicationHome home = new ApplicationHome(FileHelperLocal.class);
        File jarFile = home.getSource();
        String path = jarFile.getParentFile().toString();
        return path + "/static";
    }

    /**
     * 获取文件存储路径
     * @return
     */
    private String getDirPath() {
        return "/" + faSetting.getFile().getPrefix() + "/";
    }



    /**
     * 根据文件路径，获取存储文件，返回到http流进行下载
     * @param filePath
     * @throws IOException
     */
    public static void getLocalFilePath(String filePath) throws IOException {
        if (filePath.contains("..")) {
            throw new BuzzException("非法文件名");
        }

        File file = new File(getAbsolutePath(), filePath);

        HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
        response.setCharacterEncoding("utf-8");
        String fileName = URLEncoder.encode(file.getName(), "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName);

        //4.获取要下载的文件输入流
        InputStream in = new FileInputStream(file);
        int len = 0;
        //5.创建数据缓冲区
        byte[] buffer = new byte[1024];
        //6.通过response对象获取OutputStream流
        OutputStream out = response.getOutputStream();
        //7.将FileInputStream流写入到buffer缓冲区
        while ((len = in.read(buffer)) > 0) {
            //8.使用OutputStream将缓冲区的数据输出到客户端浏览器
            out.write(buffer, 0, len);
        }
        in.close();
    }

}
