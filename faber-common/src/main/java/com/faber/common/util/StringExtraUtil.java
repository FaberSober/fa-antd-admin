package com.faber.common.util;

import org.apache.commons.lang3.StringUtils;


public class StringExtraUtil {

    /**
     * 首字母大写{效率低}
     *
     * @param str String
     * @return String
     */
    @Deprecated
    public static String upperFirstLetter(String str) {
        str = str.substring(0, 1).toUpperCase() + str.substring(1);
        return str;
    }

    /**
     * 首字母大写
     *
     * @param str String
     * @return String
     */
    public static String upperCase(String str) {
        char a = 'a';
        char z = 'z';
        char[] ch = str.toCharArray();
        if (ch[0] >= a && ch[0] <= z) {
            ch[0] = (char) (ch[0] - 32);
        }
        return new String(ch);
    }

    public static boolean checkSuffix(String imgPath) {
        boolean flag = false;
        String[] fileTypes = new String[]{".jpg", ".bmp", ".jpeg", ".png", ".gif", ".JPG", ".BMP", ".JPEG", ".PNG", ".GIF"};
        if (!StringUtils.isBlank(imgPath)) {
            for (String fileType : fileTypes) {
                if (imgPath.endsWith(fileType)) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    public static boolean checkExcelSuffix(String filePath) {
        boolean flag = false;
        String[] fileTypes = new String[]{".xls", ".xlsx", "XLS", "XLSX"};
        if (!StringUtils.isBlank(filePath)) {
            for (String fileType : fileTypes) {
                if (filePath.endsWith(fileType)) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    public static String getUnicode(String s) {
        String result = "";
        char[] c = s.toCharArray();
        for (char tmp : c) {
            if (tmp > 255) {
                result += "\\u" + Integer.toHexString(tmp);

            } else {
                result += tmp;
            }

        }
        return result;
    }
}
