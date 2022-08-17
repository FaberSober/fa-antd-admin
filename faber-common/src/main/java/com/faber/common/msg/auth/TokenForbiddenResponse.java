package com.faber.common.msg.auth;

import com.faber.common.constant.RestCodeConstants;
import com.faber.common.msg.BaseResponse;

/**
 */
public class TokenForbiddenResponse  extends BaseResponse {
    public TokenForbiddenResponse(String message) {
        super(RestCodeConstants.TOKEN_FORBIDDEN_CODE, message);
    }
}
