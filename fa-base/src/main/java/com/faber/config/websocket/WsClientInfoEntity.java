package com.faber.config.websocket;

import com.faber.api.base.admin.entity.User;
import com.faber.core.config.websocket.ClientInfoEntity;
import lombok.Data;

@Data
public class WsClientInfoEntity extends ClientInfoEntity {

    /**
     * 用户信息
     */
    private User user;

}
