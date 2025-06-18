/**
 *
 * (c) Copyright Ascensio System SIA 2023
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package com.faber.api.base.doc.models.configurations;

import cn.hutool.extra.spring.SpringUtil;
import com.faber.api.base.admin.biz.ConfigSysBiz;
import com.faber.core.constant.FaSetting;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;

@Component
@Scope("prototype")
@Getter
@Setter
public class Logo {  // the image file at the top left corner of the Editor header
//    @Value("${logo.image}")
    private String image = "";  // the path to the image file used to show in common work mode

//    @Value("${logo.imageEmbedded}")
    private String imageEmbedded = "";  // the path to the image file used to show in the embedded mode

//    @Value("${logo.url}")
    private String url = "";  // the absolute URL which will be used when someone clicks the logo image

    @PostConstruct
    public void init() {
        ConfigSysBiz configSysBiz = SpringUtil.getBean(ConfigSysBiz.class);
        FaSetting faSetting = SpringUtil.getBean(FaSetting.class);

        this.image = faSetting.getOnlyoffice().getCallbackServer() + "api/base/admin/fileSave/getFile/" + configSysBiz.getConfig().getLogo();
        this.imageEmbedded = faSetting.getOnlyoffice().getCallbackServer() + "api/base/admin/fileSave/getFile/" + configSysBiz.getConfig().getLogo();
    }

}
