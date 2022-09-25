package com.faber.admin.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
public class GroupUserVo {

    private Integer id;
    private Integer groupId;
    private String type;
    private String typeName;
    private String description;

    private String userId;
    private String name;
    private String username;
    private String birthday;
    private String address;
    private String tel;
    private String email;
    private String sex;

}
