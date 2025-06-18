package com.faber.api.app;

import cn.hutool.http.useragent.UserAgent;
import cn.hutool.http.useragent.UserAgentUtil;
import net.dongliu.apk.parser.ApkFile;
import net.dongliu.apk.parser.bean.ApkMeta;
import net.dongliu.apk.parser.bean.IconFace;
import net.dongliu.apk.parser.bean.UseFeature;
import org.junit.jupiter.api.Test;

import java.io.*;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

/**
 * @author Farando
 * @date 2023/1/15 23:02
 * @description
 */
public class AppInfoTest {

//    private String filePath = "D:\\Temp\\file\\apk\\app-release.apk";
    private String filePath = "/Users/xupengfei/Downloads/tmp/app-release-1.0.1.apk";

    @Test
    public void testGetAppInfo() throws IOException {
        File file = new File(filePath);
        ApkFile apkFile = new ApkFile(file);
        ApkMeta apkMeta = apkFile.getApkMeta();
        System.out.println(apkMeta.getLabel());
        System.out.println(apkMeta.getPackageName());
        System.out.println(apkMeta.getVersionCode());
        for (UseFeature feature : apkMeta.getUsesFeatures()) {
            System.out.println(feature.getName());
        }

        System.out.println("应用名称   :" + apkMeta.getLabel());
        System.out.println("包名       :" + apkMeta.getPackageName());
        System.out.println("版本号     :" + apkMeta.getVersionCode());
        System.out.println("版本名     :" + apkMeta.getVersionName());
        System.out.println("图标       :" + apkMeta.getIcon());
        System.out.println("大小       :" + (double) (file.length() * 100 / 1024 / 1024) / 100 + " MB");
        //  System.out.println("全部       :===============================");
        //  System.out.println(apkMeta.toString());

        //  解析图标
        List<IconFace> icons = apkFile.getAllIcons();

        //  拷贝图标
//        saveBit(filePath, apkMeta.getIcon());
    }

    //  拷贝图标
    public static void saveBit(String filePath, String Icon) throws IOException {
        ZipInputStream zin = null;
        File file = new File(filePath);

        try {
            //  访问apk 里面的文件
            ZipFile zf = new ZipFile(filePath);
            InputStream in = new BufferedInputStream(new FileInputStream(file));
            zin = new ZipInputStream(in);
            ZipEntry ze;
            while ((ze = zin.getNextEntry()) != null) {
                if (ze.getName().equals(Icon)) {
                    //  拷贝出图标
                    System.out.println("拷贝开始");
                    InputStream inStream = zf.getInputStream(ze);

                    ByteArrayOutputStream outStream = new ByteArrayOutputStream();
                    //创建一个Buffer字符串
                    byte[] buffer = new byte[1024];
                    //每次读取的字符串长度，如果为-1，代表全部读取完毕
                    int len = 0;
                    //使用一个输入流从buffer里把数据读取出来
                    while ((len = inStream.read(buffer)) != -1) {
                        //用输出流往buffer里写入数据，中间参数代表从哪个位置开始读，len代表读取的长度
                        outStream.write(buffer, 0, len);
                    }
                    //关闭输入流
                    inStream.close();
                    //把outStream里的数据写入内存

                    //得到图片的二进制数据，以二进制封装得到数据，具有通用性
                    byte[] data = outStream.toByteArray();
                    //new一个文件对象用来保存图片，默认保存当前工程根目录
                    File imageFile = new File("D:\\Temp\\file\\apk\\icon.png");
                    //创建输出流
                    FileOutputStream fileOutStream = new FileOutputStream(imageFile);
                    //写入数据
                    fileOutStream.write(data);
                    System.out.println("拷贝结束");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            zin.closeEntry();
        }
    }

    @Test
    public void testGetAgentInfo() {
        String agent = "Mozilla/5.0 (Linux; Android 10; EVR-AL00 Build/HUAWEIEVR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.0.0 Mobile Safari/537.36 baiduboxapp/11.0.5.12 (Baidu; P1 10)";
        UserAgent ua = UserAgentUtil.parse(agent);
        System.out.println(ua.getBrowser());
        System.out.println(ua.getEngine());
        System.out.println(ua.getEngineVersion());
        System.out.println(ua.getOs());
        System.out.println(ua.getOsVersion());
        System.out.println(ua.getPlatform());
        System.out.println(ua.getVersion());
    }

}
