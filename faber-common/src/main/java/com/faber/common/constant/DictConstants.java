package com.faber.common.constant;

import java.util.HashMap;
import java.util.Map;

/**
 * 系统常用常量
 */
public class DictConstants {

    /** 权限资源类型 */
    public final static class CommonUserStatus {
        public static final String DICT_LABEL = "common_user_status";

        public static final class Value {
            public static final String NORMAL = "1";
            public static final String FROZEN = "2";
        }
    }

    /** 权限资源类型 */
    public final static class CommonSex {
        public static final String DICT_LABEL = "common_sex";

        public static final class Value {
            public static final String SECRET = "0";
            public static final String MAIL = "1";
            public static final String FEMAIL = "2";
        }
    }

    /** 权限资源类型 */
    public final static class StoreMemberMoneyType {
        public static final String DICT_LABEL = "store_member_money_type";

        public static final class Value {
            public static final String CHARGE = "1";
            public static final String PAY = "2";
        }
    }

    /** 地区-层级 */
    public final static class AreaLevel {
        public static final String DICT_LABEL = "common_area_level";

        public static final class Value {
            public static final int NATION = -1;
            public static final int PROVINCE = 0;
            public static final int CITY = 1;
            public static final int COUNTY = 2;
            public static final int COUNTRY = 3;
            public static final int VILLAGE = 4;
        }

        public static final Map<String, String> LABEL = new HashMap<String, String>() {
            {
                put("-1", "国家");
                put("0", "省");
                put("1", "市");
                put("2", "区县");
                put("3", "乡");
                put("4", "村");
            }
        };
    }

    /**
     * 中国地区编码-中国编码-6位
     */
    public final static int AREA_CODE_CHINA = 100000;

    /**
     * 中国地区编码-中国编码-6位
     */
    public final static long AREA_CODE_CHINA_12 = 100000000000L;
}
