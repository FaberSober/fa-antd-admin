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

package com.faber.api.base.doc.models.filemodel;

import com.faber.api.base.doc.models.AbstractModel;
import com.faber.core.context.BaseContextHandler;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
@Scope("prototype")
@Getter
@Setter
public class User extends AbstractModel {
    private String id;
    private String name;
    private String group;

    @PostConstruct
    public void init() {
        this.configure(BaseContextHandler.getUserId(), BaseContextHandler.getName(), "group");
    }

    // the user configuration parameters
    public void configure(final String idParam, final String nameParam, final String groupParam) {
        this.id = idParam;  // the user id
        this.name = nameParam;  // the user name
        this.group = groupParam;  // the group the user belongs to
    }
}
