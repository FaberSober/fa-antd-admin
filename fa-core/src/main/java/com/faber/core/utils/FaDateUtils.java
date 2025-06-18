package com.faber.core.utils;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.StrUtil;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

/**
 * @author Farando
 * @date 2023/2/19 17:27
 * @description
 */
public class FaDateUtils {

    public static Date beginOfToday() {
        return DateUtil.beginOfDay(new Date());
    }

    public static Date endOfToday() {
        return DateUtil.endOfDay(new Date());
    }

    /**
     * 用于记录日志的时间格式：yyyy-MM-dd HH:mm:ss.SSS
     * @return
     */
    public static String nowLog() {
        return DateUtil.format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
    }

    /**
     * timestamp to Date
     * @param timestamp 1672502400L
     * @return Date
     */
    public static Date timestampToDate(long timestamp) {
        Timestamp ts  = new Timestamp(timestamp * 1000);
        return new Date(ts.getTime());
    }

    /**
     * 标准化日期，默认处理以空格区分的日期时间格式，空格前为日期，空格后为时间：<br>
     * 将以下字符替换为"-"
     *
     * <pre>
     * "."
     * "/"
     * "年"
     * "月"
     * </pre>
     * <p>
     * 将以下字符去除
     *
     * <pre>
     * "日"
     * </pre>
     * <p>
     * 将以下字符替换为":"
     *
     * <pre>
     * "时"
     * "分"
     * "秒"
     * </pre>
     * <p>
     * 当末位是":"时去除之（不存在毫秒时）
     *
     * @param dateStr 日期时间字符串
     * @return 格式化后的日期字符串
     */
    public static String normalize(CharSequence dateStr) {
        if (StrUtil.isBlank(dateStr)) {
            return StrUtil.str(dateStr);
        }

        // 将中文[：]替换为":"
        dateStr = dateStr.toString().replaceAll("[：]", ":");

        // 日期时间分开处理
        final List<String> dateAndTime = StrUtil.splitTrim(dateStr, ' ');
        final int size = dateAndTime.size();
        if (size < 1 || size > 2) {
            // 非可被标准处理的格式
            return StrUtil.str(dateStr);
        }

        final StringBuilder builder = StrUtil.builder();

        // 日期部分（"\"、"/"、"."、"年"、"月"都替换为"-"）
        String datePart = dateAndTime.get(0).replaceAll("[/.年月]", "-");
        datePart = StrUtil.removeSuffix(datePart, "日");

        // 月日部分补齐0，如9补齐为09
        String[] datePartArr = datePart.split("-");
        for (int i = 0; i < datePartArr.length; i++) {
            datePartArr[i] = fixNum(datePartArr[i]);
        }
        datePart = ArrayUtil.join(datePartArr, "-");

        builder.append(datePart);

        // 时间部分
        if (size == 2) {
            builder.append(' ');
            String timePart = dateAndTime.get(1).replaceAll("[时分秒]", ":");
            timePart = StrUtil.removeSuffix(timePart, ":");
            //将ISO8601中的逗号替换为.
            timePart = timePart.replace(',', '.');

            // 时分秒部分补齐0，如9补齐为09
            List<String> timePartArr = StrUtil.splitTrim(timePart, ":");
            for (int i = 0; i < timePartArr.size(); i++) {
                timePartArr.set(i, fixNum(timePartArr.get(i)));
            }

            // 补全分钟
            if (timePartArr.size() < 2) {
                timePartArr.add("00");
            }
            // 补全秒钟
            if (timePartArr.size() < 3) {
                timePartArr.add("00");
            }

            timePart = ArrayUtil.join(timePartArr.toArray(), ":");

            builder.append(timePart);
        }

        return builder.toString();
    }

    /**
     * 将小于10的数字补全为加前置0的字符串
     * @param num
     * @return
     */
    public static String fixNum(String num) {
        return num.length() < 2 ? "0" + num : num;
    }

}
