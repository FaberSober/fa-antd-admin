package com.faber.core.config.filter.wrapper;

import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Map;

/**
 * 请求重放-request覆盖定义
 * @author xu.pengfei
 * @date 2022/11/28 11:38
 */
public class BodyHttpServletRequestWrapper extends HttpServletRequestWrapper {
    private byte[] body;
    private ServletInputStream inputStream;

    public BodyHttpServletRequestWrapper(HttpServletRequest request) throws IOException {
        super(request);
        StandardServletMultipartResolver standardServletMultipartResolver = new StandardServletMultipartResolver();
        //做判断，过滤掉form表单形式的，避免form表单的参数
        if (standardServletMultipartResolver.isMultipart(request)) {
            body = new byte[]{};
        } else {
            body = StreamUtils.copyToByteArray(request.getInputStream());
            inputStream = new RequestCachingInputStream(body);
        }
    }

    public String getBody() {
        return new String(body);
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        if (inputStream != null) {
            return inputStream;
        }
        return super.getInputStream();
    }

    @Override
    public Map<String, String[]> getParameterMap() {
        return super.getParameterMap();
    }

    private static class RequestCachingInputStream extends ServletInputStream {

        private final ByteArrayInputStream inputStream;

        public RequestCachingInputStream(byte[] bytes) {
            inputStream = new ByteArrayInputStream(bytes);
        }

        @Override
        public int read() throws IOException {
            return inputStream.read();
        }

        @Override
        public boolean isFinished() {
            return inputStream.available() == 0;
        }

        @Override
        public boolean isReady() {
            return true;
        }

        @Override
        public void setReadListener(ReadListener readlistener) {
        }

    }
}
