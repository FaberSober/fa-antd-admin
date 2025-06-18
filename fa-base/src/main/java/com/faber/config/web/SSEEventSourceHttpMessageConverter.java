package com.faber.config.web;

import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.http.converter.AbstractHttpMessageConverter;

import java.io.IOException;
import java.nio.charset.Charset;

public class SSEEventSourceHttpMessageConverter extends AbstractHttpMessageConverter<ServerSentEvent> {

    public SSEEventSourceHttpMessageConverter() {
        super(new MediaType("text", "event-stream", Charset.forName("UTF-8")));
    }

    @Override
    protected boolean supports(Class<?> clazz) {
//        return ServerSentEvent.class.isAssignableFrom(clazz);
        return true;
    }

    @Override
    protected ServerSentEvent readInternal(Class<? extends ServerSentEvent> clazz, HttpInputMessage inputMessage) throws IOException, IOException {
        // 实现反序列化逻辑
        return null;
    }

    @Override
    protected void writeInternal(ServerSentEvent sseEvent, HttpOutputMessage outputMessage) throws IOException {
        // 实序列化逻辑
        System.out.println("sseEvent: " + sseEvent.toString());
    }
}
