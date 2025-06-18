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

package com.faber.api.base.doc.models.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum Action {
    edit(0, "edit"), // 文件编辑：文件关闭后，保存文件，触发文件编辑
    review(1, "review"), // 文件查看：文件打开时，触发文件review查看
    view(2, "view"),
    embedded(3, "embedded"),
    filter(4, "filter"),
    comment(5, "comment"),
    chat(6, "chat"),
    fillForms(7, "fillForms"),
    blockcontent(8, "blockcontent");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    Action(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }
}
