package com.faber.core.config.logmonitor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoggerMessage implements Serializable {

    private String body;

    private String timestamp;

    private String threadName;

    private String className;

    private String level;

    private String exception;

    private String cause;
}
