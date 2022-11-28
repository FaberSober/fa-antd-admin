package com.faber.core.config.filter.wrapper;


import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

/**
 * 请求重放-response覆盖定义
 * @author xu.pengfei
 * @date 2022/11/28 11:39
 */
public class BodyHttpServletResponseWrapper extends HttpServletResponseWrapper {
    private ByteArrayOutputStream byteArrayOutputStream;
    private ServletOutputStream servletOutputStream;
    private PrintWriter writer;


    public BodyHttpServletResponseWrapper(HttpServletResponse response) {
        super(response);
        byteArrayOutputStream = new ByteArrayOutputStream();
        servletOutputStream = new WrapperOutputStream(byteArrayOutputStream);
        writer = new PrintWriter(new OutputStreamWriter(byteArrayOutputStream, StandardCharsets.UTF_8));
    }

    @Override
    public ServletOutputStream getOutputStream() {
        return servletOutputStream;
    }

    @Override
    public PrintWriter getWriter() {
        return writer;
    }

//    public String getBody() {
//        return new String(getContent());
//    }

    @Override
    public void flushBuffer() {
        if (servletOutputStream != null) {
            try {
                servletOutputStream.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if (writer != null)
            writer.flush();
    }

    @Override
    public void reset() {
        byteArrayOutputStream.reset();
    }

    public String getResponseData(String charset) throws IOException {
        flushBuffer();
        byte[] bytes = byteArrayOutputStream.toByteArray();
        return new String(bytes, charset);
    }

    private class WrapperOutputStream extends ServletOutputStream {

        private ByteArrayOutputStream bos;

        public WrapperOutputStream(ByteArrayOutputStream stream) {
            bos = stream;
        }

        @Override
        public boolean isReady() {
            return false;
        }

        @Override
        public void setWriteListener(WriteListener writeListener) {

        }

        @Override
        public void write(int b) {
            bos.write(b);
        }
    }

    public byte[] getContent() {
        flushBuffer();
        return byteArrayOutputStream.toByteArray();
    }
}
