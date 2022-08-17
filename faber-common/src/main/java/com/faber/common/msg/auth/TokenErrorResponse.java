package com.faber.common.msg.auth;

import com.faber.common.constant.RestCodeConstants;
import com.faber.common.msg.BaseResponse;

/**
 */
public class TokenErrorResponse extends BaseResponse {
    public TokenErrorResponse(String message) {
        super(RestCodeConstants.TOKEN_ERROR_CODE, message);
    }
}
