package com.faber.api.admin.file;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.junit.jupiter.api.Test;

import java.io.*;
import java.net.URLDecoder;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 大文件下载：https:// blog.csdn.net/afreon/article/details/124996094
 */
@Slf4j
public class FileDownloadTest {

    /**
     * 测试分片下载文件
     */
    @Test
    public void testDownloadFileWithShard() throws IOException, InterruptedException {
        String url = "http://127.0.0.1/api/base/admin/fileSave/getFile/f734187148c3b9a4d3efebc9b6dff481";
        FileInfo fileInfo = download(url, 0, 10, -1, null);
        if (fileInfo != null) {
            long pages = fileInfo.fSize / per_page;
            for (int i = 0; i <= pages; i++) {
                pool.submit(new Download(url, i * per_page, (i + 1) * per_page - 1, i, fileInfo.fName));
            }
        }

        Thread.sleep(10 * 1000);
    }

    private final static long per_page = 1024l * 1024l * 1l;

    // 分片存储临时目录 当分片下载完后在目录中找到文件合并
    private final static String down_path = "/Users/xupengfei/tmp/file/file-shard";

    // 多线程下载
    ExecutorService pool = Executors.newFixedThreadPool(10);

    // 文件大小 分片数量 文件名称
    // 使用探测 获取变量
    // 使用多线程分片下载
    // 最后一个分片下载完 开始合并
//     @RequestMapping("/downloadFile")
//     public String downloadFile() throws IOException {
//         FileInfo fileInfo = download(0, 10, -1, null);
//         if (fileInfo != null) {
//             long pages = fileInfo.fSize / per_page;
//             for (int i = 0; i <= pages; i++) {
//                 pool.submit(new Download(i * per_page, (i + 1) * per_page - 1, i, fileInfo.fName));
//             }
//         }
// 
//         return "成功";
//     }

    class Download implements Runnable {
        String url;
        long start;
        long end;
        long page;
        String fName;

        public Download(String url, long start, long end, long page, String fName) {
            this.url = url;
            this.start = start;
            this.end = end;
            this.page = page;
            this.fName = fName;
        }

        @Override
        public void run() {
            try {
                FileInfo fileInfo = download(url, start, end, page, fName);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    // 返回文件名 跟大小
    private FileInfo download(String url, long start, long end, long page, String fName) throws IOException {
        log.debug("download start:{} end:{} page:{}", start, end, page);
        
        // 断点下载 文件存在不需要下载
        File file = new File(down_path, page + "-" + fName);
        // 探测必须放行 若下载分片只下载一半就锻炼需要重新下载所以需要判断文件是否完整
        if (file.exists() && page != -1 && file.length() == per_page) {
            return null;
        }
        // 需要知道  开始-结束 = 分片大小
        HttpClient client = HttpClients.createDefault();
        // httpclient进行请求
        HttpGet httpGet = new HttpGet(url);
        // 告诉服务端做分片下载
        httpGet.setHeader("Range", "bytes=" + start + "-" + end);
        HttpResponse response = client.execute(httpGet);
        String fSize = response.getFirstHeader("fa-size").getValue();
        fName = URLDecoder.decode(response.getFirstHeader("fa-filename").getValue(), "utf-8");
        HttpEntity entity = response.getEntity();// 获取文件流对象
        InputStream is = entity.getContent();
        // 临时存储分片文件
        FileOutputStream fos = new FileOutputStream(file);
        byte[] buffer = new byte[1024];// 定义缓冲区
        int ch;
        while ((ch = is.read(buffer)) != -1) {
            fos.write(buffer, 0, ch);
        }
        is.close();
        fos.flush();
        fos.close();
        // 判断是不是最后一个分片
        if (end - Long.valueOf(fSize) > 0) {
            // 合并
            try {
                mergeFile(fName, page);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return new FileInfo(Long.valueOf(fSize), fName);
    }

    private void mergeFile(String fName, long page) throws Exception {
        log.debug("mergeFile page:{}", page);
        // 归并文件位置
        File file = new File(down_path, fName);
        BufferedOutputStream os = new BufferedOutputStream(new FileOutputStream(file));
        for (int i = 0; i <= page; i++) {
            File tempFile = new File(down_path, i + "-" + fName);
            // 分片没下载或者没下载完需要等待
            while (!file.exists() || (i != page && tempFile.length() < per_page)) {
                Thread.sleep(100);
            }
            byte[] bytes = FileUtils.readFileToByteArray(tempFile);
            os.write(bytes);
            os.flush();
            tempFile.delete();
        }
        File file1 = new File(down_path, -1 + "-null");
        file1.delete();
        os.flush();
        os.close();
    }

    // 使用内部类实现
    class FileInfo {
        long fSize;
        String fName;

        public FileInfo(long fSize, String fName) {
            this.fSize = fSize;
            this.fName = fName;
        }
    }

}
