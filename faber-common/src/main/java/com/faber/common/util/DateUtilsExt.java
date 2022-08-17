package com.faber.common.util;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * 日期工具类
 *
 * @author zhangpeng
 * @date 2019-05-27
 */
public class DateUtilsExt {

    public final static String YYYY = "yyyy";

    public final static String MM = "MM";

    public final static String DD = "dd";

    public final static String YYYY_MM_DD = "yyyy-MM-dd";

    public final static String YYYYMMDD = "yyyyMMdd";

    public final static String YYYY_MM = "yyyy-MM";

    public final static String YYYYMM = "yyyyMM";

    public final static String YYYY_WW = "yyyy-WW";

    public final static String YYYYWW = "yyyyWW";

    public final static String YYYYMMDDHHMMSS = "yyyyMMddHHmmss";

    public final static String YYYYMMDDHHMMSSSSS = "yyyyMMddHHmmssSSS";

    public final static String HH_MM_SS = "HH:mm:ss";

    public final static String DATE_RULE_COMMON = "yyyy-MM-dd HH:mm:ss";

    public final static String YYYY_MM_DD_HH_MM = "yyyy-MM-dd HH:mm";

    public final static String YYYY_MM_DD_HH_MM_SS_SSS = "yyyy-MM-dd HH:mm:ss.SSS";

    public final static String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd-HH-mm-ss";

    public final static String YYYY_MM_DD_HH_MM_SS_SSS_CN = "yyyy年MM月dd日HH时mm分ss秒";

    public final static String YYMMDD = "yyMMdd";

    public static final String DEFAULT_TIME_STR = "2000-01-01 00:00:00";

    public static final String PMS_DEFAULT_TIME_STR = "1970-01-01 08:00:01";

    public static final Date PMS_DEFAULT_TIME = parse(PMS_DEFAULT_TIME_STR, DATE_RULE_COMMON);

    public static final String LOCAL_TIMEZONE = "Asia/Shanghai";

    public static final String YEAR_STRING = "1970";

    public static final String DAY_END = " 23:59:59";

    public static final long DAYS_MILLIONS_SECONDS = 86400000;

    public static final long HOURS_MILLIONS_SECONDS = 60 * 60 * 1000;

    /**
     * yyyy-mm-dd hh:mm:ss
     */
    public static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat(DateUtilsExt.DATE_RULE_COMMON);

    /**
     * YYYY-MM-DD
     */
    public static final SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat(DateUtilsExt.YYYY_MM_DD);

    /**
     * 日期格式化－将<code>Date</code>类型的日期格式化为<code>String</code>型
     *
     * @param date    待格式化的日期
     * @param pattern 时间样式
     * @return 一个被格式化了的<code>String</code>日期
     */
    public static String format(Date date, String pattern) {
        if (date == null) {
            return "";
        } else {
            return DateFormatUtils.format(date, pattern);
        }
    }

    /**
     * 日期格式化－将<code>Date</code>类型的日期格式化为<code>String</code>型
     *
     * @param date    待格式化的日期
     * @param pattern 时间样式
     * @return 一个被格式化了的<code>String</code>日期
     */
    public static String format(LocalDateTime date, String pattern) {
        if (date == null) {
            return "";
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
            return formatter.format(date);
        }
    }

    /**
     * 默认为yyyy-MM-dd格式的解析
     *
     * @param strDate strDate
     * @return Date
     */
    public static Date parse(String strDate) {
        return parse(strDate, YYYY_MM_DD);
    }

    /**
     * 日期解析－将<code>String</code>类型的日期解析为<code>Date</code>型
     * ParseException 如果所给的字符串不能被解析成一个日期
     *
     * @param strDate 待解析的日期字符串
     * @param pattern 日期格式
     * @return 一个被格式化了的<code>Date</code>日期
     */
    public static Date parse(String strDate, String pattern) {
        try {
            return DateUtils.parseDate(strDate, pattern);
        } catch (ParseException e) {
            throw new RuntimeException("待解析的日期字符串", e);
        }
    }

    public static Date toDate(LocalDateTime localDateTime) {
        ZoneId zoneId = ZoneId.systemDefault();
        ZonedDateTime zdt = localDateTime.atZone(zoneId);

        return Date.from(zdt.toInstant());
    }

    /**
     * LocalDate转Date
     *
     * @param localDate LocalDate
     * @return Date
     */
    public static Date localDate2Date(LocalDate localDate) {
        if (null == localDate) {
            return null;
        }
        ZonedDateTime zonedDateTime = localDate.atStartOfDay(ZoneId.systemDefault());
        return Date.from(zonedDateTime.toInstant());
    }

    public static LocalDateTime toLocalDateTime(Date date) {
        ZoneId zoneId = ZoneId.systemDefault();
        return date.toInstant().atZone(zoneId).toLocalDateTime();
    }

    /**
     * 日期解析－将<code>String</code>类型的日期解析为<code>Date</code>型
     * ParseException 如果所给的字符串不能被解析成一个日期
     *
     * @param strDate 待解析的日期字符串
     * @param pattern 日期格式
     * @return 一个被格式化了的<code>Date</code>日期
     */
    public static LocalDateTime parseLocalDateTime(String strDate, String pattern) {
        return LocalDateTime.parse(strDate, DateTimeFormatter.ofPattern(pattern));
    }

    /**
     * 获取指定毫秒数所表示的日期
     *
     * @param millis millis the new time in UTC milliseconds from the epoch.
     * @return Date
     */
    public static Date getDate(long millis) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(millis);
        return calendar.getTime();
    }

    /**
     * 获取间隔日期 <br>
     * 〈功能详细描述〉
     *
     * @param date      基准日期
     * @param field     指定日期字段
     * @param intervals 间隔数
     * @return Date
     * @see [相关类/方法](可选)
     * @since [产品/模块版本](可选)
     */
    public static Date getDate(Date date, int field, int intervals) {
        try {
            Calendar calendar = Calendar.getInstance();
            if (date != null) {
                calendar.setTime(date);
            }
            calendar.set(field, calendar.get(field) + intervals);
            return calendar.getTime();
        } catch (Exception e) {
            throw new RuntimeException("获取间隔日期", e);
        }
    }

    /**
     * 获取月末日期
     *
     * @param day Date
     * @return Date
     */
    public static Date getMonthEndDate(Date day) {
        Calendar cale = Calendar.getInstance();
        cale.setTime(day);
        cale.add(Calendar.MONTH, 1);
        cale.set(Calendar.DAY_OF_MONTH, 0);
        return cale.getTime();
    }

    /**
     * 获取月末时间  2018-04-30 23:59:59
     *
     * @param day Date
     * @return Date
     */
    public static Date getMonthEndTime(Date day) {
        Calendar cale = Calendar.getInstance();
        cale.setTime(day);
        cale.set(Calendar.DATE, cale.getActualMaximum(Calendar.DATE));
        //时
        cale.set(Calendar.HOUR_OF_DAY, 23);
        //分
        cale.set(Calendar.MINUTE, 59);
        //秒
        cale.set(Calendar.SECOND, 59);
        cale.set(Calendar.MILLISECOND, 999);
        return cale.getTime();
    }

    /**
     * 获取年开始时间 2020-01-01 00:00:00
     *
     * @param day Date
     * @return Date
     */
    public static Date getYearStartTime(Date day) {
        Calendar cale = Calendar.getInstance();
        cale.setTime(day);
        cale.set(cale.get(Calendar.YEAR), Calendar.JANUARY, 1, 0, 0, 0);
        cale.set(Calendar.MILLISECOND, 0);
        return cale.getTime();
    }

    /**
     * 获取月初开始时间 2018-04-01 00:00:00
     *
     * @param day Date
     * @return Date
     */
    public static Date getMonthStartTime(Date day) {
        Calendar cale = Calendar.getInstance();
        cale.setTime(day);
        cale.set(Calendar.DAY_OF_MONTH, 1);
        //时
        cale.set(Calendar.HOUR_OF_DAY, 0);
        //分
        cale.set(Calendar.MINUTE, 0);
        //秒
        cale.set(Calendar.SECOND, 0);
        cale.set(Calendar.MILLISECOND, 0);
        return cale.getTime();
    }

    /**
     * 当前时间所在月份的下个月份1号00:00:00
     *
     * @param day Date
     * @return Date
     */
    public static Date getNextMonthStartTime(Date day) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(day);
        cal.setTime(getMonthStartTime(day));
        cal.add(Calendar.MONTH, 1);
        return cal.getTime();
    }

    /**
     * 当前时间所在季度的开始月份1号00:00:00
     *
     * @param day Date
     * @return Date
     */
    public static Date getQuarterStartTime(Date day) {
        Calendar c = Calendar.getInstance();
        c.setTime(day);
        int currentMonth = c.get(Calendar.MONTH) + 1;
        SimpleDateFormat longSdf = new SimpleDateFormat(DATE_RULE_COMMON);
        SimpleDateFormat shortSdf = new SimpleDateFormat(YYYY_MM_DD);
        Date now = null;
        try {
            if (currentMonth <= 3) {
                c.set(Calendar.MONTH, 0);
            } else if (currentMonth <= 6) {
                c.set(Calendar.MONTH, 3);
            } else if (currentMonth <= 9) {
                c.set(Calendar.MONTH, 4);
            } else if (currentMonth <= 12) {
                c.set(Calendar.MONTH, 9);
            }
            c.set(Calendar.DATE, 1);
            now = longSdf.parse(shortSdf.format(c.getTime()) + " 00:00:00");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 当前时间所在季度的下个季度开始月份1号00:00:00
     *
     * @param day Date
     * @return Date
     */
    public static Date getNextQuarterStartTime(Date day) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(day);
        cal.setTime(getQuarterStartTime(day));
        cal.add(Calendar.MONTH, 3);
        return cal.getTime();
    }

    /**
     * 获取某天的开始时间
     *
     * @param date 日期
     * @return Date
     */
    public static Date beginOfDay(Date date) {
        return beginOfDay(calendar(date)).getTime();
    }

    /**
     * 获取某天的结束时间
     *
     * @param date 日期
     * @return Date
     */
    public static Date endOfDay(Date date) {
        return endOfDay(calendar(date)).getTime();
    }

    /**
     * 获取某天的开始时间
     *
     * @param calendar 日期 {@link Calendar}
     * @return {@link Calendar}
     */
    public static Calendar beginOfDay(Calendar calendar) {
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar;
    }

    /**
     * 获取某天的结束时间
     *
     * @param calendar 日期 {@link Calendar}
     * @return {@link Calendar}
     */
    public static Calendar endOfDay(Calendar calendar) {
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar;
    }

    /**
     * 转换为Calendar对象
     *
     * @param date 日期对象
     * @return Calendar对象
     */
    public static Calendar calendar(Date date) {
        return calendar(date.getTime());
    }

    /**
     * 转换为Calendar对象
     *
     * @param millis 时间戳
     * @return Calendar对象
     */
    public static Calendar calendar(long millis) {
        final Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(millis);
        return cal;
    }

    /**
     * 计算两个日期相差的天数，end-start
     *
     * @param start Date
     * @param end   Date
     * @return long
     */
    public static long daysBetween(Date start, Date end) {
        long diff = (beginOfDay(end).getTime() - beginOfDay(start).getTime()) / 86400000;
        return Math.abs(diff);
    }

    /**
     * 计算两个日期相差的小时，end-start 绝对值
     *
     * @param start Date
     * @param end   Date
     * @return long
     */
    public static long hoursBetween(Date start, Date end) {
        long diff = (end.getTime() - start.getTime()) / (60 * 60 * 1000);
        return Math.abs(diff);
    }

    /**
     * 时间差 非绝对值
     *
     * @param end   减数
     * @param start 被减数
     * @return 结果
     */
    public static long hoursReduction(Date start, Date end) {
        return (start.getTime() - end.getTime()) / (60 * 60 * 1000);
    }

    /**
     * 根据月期间获取当月所有天数
     *
     * @param accPeriod 列如："2018-01"
     * @return 一个月的天数list
     */
    public static List<Date> getDayOfMonth(String accPeriod) {
        List<Date> days = new ArrayList<>();
        Date month = parse(accPeriod, YYYY_MM);
        Date monthBegin = getMonthStartTime(month);
        Date monthEnd = getMonthEndTime(month);
        int difDate = (int) daysBetween(monthBegin, monthEnd);

        Calendar calendar = Calendar.getInstance();

        for (int i = 0; i <= difDate; i++) {
            calendar.setTime(monthBegin);
            calendar.add(Calendar.DATE, i);
            days.add(calendar.getTime());
        }
        return days;
    }

    /**
     * 获取前n天或者后n天的date
     *
     * @param date date
     * @param day  -1 1天前的时间,+1一天后的时间
     * @return date
     */
    public static Date getDayDifference(Date date, int day) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, day);
        return cal.getTime();
    }

    public static Date getDataBaseInitTime() {
        try {
            String time = "1970-01-01 08:00:01";
            SimpleDateFormat sdf = new SimpleDateFormat(DateUtilsExt.DATE_RULE_COMMON);
            return sdf.parse(time);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String formatDate(Date date) {
        return DateUtilsExt.format(date, DateUtilsExt.DATE_RULE_COMMON);
    }

    /**
     * 判断日期是否为默认初始时间
     *
     * @param date 时间
     * @return true表示是默认初始时间, false反之
     */
    public static boolean isInitTime(Date date) {
        return date != null && date.getTime() == PMS_DEFAULT_TIME.getTime();
    }

    /**
     * 获取前端正确显示的时间
     *
     * @param originalDate 传入时间
     * @return 前端正确显示的时间；把"1970-01-01 08:00:01"变为""
     */
    public static String getRealDate(Date originalDate) {
        return isInitTime(originalDate) ? "" : formatDate(originalDate);
    }

    /**
     * 获取前端正确显示的时间
     *
     * @param originalDate 传入时间
     * @return 前端正确显示的时间；把"1970-01-01 08:00:01"变为""
     */
    public static String getRealDate(String originalDate) {
        return PMS_DEFAULT_TIME_STR.equals(originalDate) ? "" : originalDate;
    }

    /**
     * 获取前n月或者后n月的date
     *
     * @param date  date
     * @param month -1 1月前的时间,+1一月后的时间
     * @return date
     */
    public static Date getMonthDifference(Date date, int month) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, month);
        return cal.getTime();
    }

    /**
     * 日期转星期
     *
     * @param datetime String
     * @return String
     */
    public static String dateToWeek(String datetime) {
        SimpleDateFormat f = new SimpleDateFormat(DateUtilsExt.YYYY_MM_DD);
        String[] weekDays = {"周日", "周一", "周二", "周三", "周四", "周五", "周六"};
        // 获得一个日历
        Calendar cal = Calendar.getInstance();
        Date datet = null;
        try {
            datet = f.parse(datetime);
            cal.setTime(datet);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // 指示一个星期中的某天。
        int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
        if (w < 0) {
            w = 0;
        }
        return weekDays[w];
    }

    /**
     * 判断日期是否是当月第一天
     *
     * @param date Date
     * @return boolean
     */
    public static boolean isMonthStartDay(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int day = cal.get(Calendar.DATE);
        return day == 1;
    }

    /**
     * 获取上个月的今天（号）
     *
     * @param date Date
     * @return Date
     */
    public static Date getLastMonthDay(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, -1);
        return cal.getTime();
    }

    /**
     * 获取时间加上或减去分钟后的时间
     *
     * @param date Date
     * @return Date
     */
    public static Date getMinuteDate(Date date, Integer minutes) {

        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MINUTE, minutes);
        return cal.getTime();
    }


    /**
     * 两个日期间的所有日期
     *
     * @param begin 开始时间
     * @param end   结束时间
     * @return 日期集合
     */
    public static List<Date> getBetweenDates(Date begin, Date end) {
        List<Date> result = new ArrayList<>();
        Calendar tempStart = Calendar.getInstance();
        tempStart.setTime(begin);
        while (begin.getTime() <= end.getTime()) {
            result.add(tempStart.getTime());
            tempStart.add(Calendar.DAY_OF_YEAR, 1);
            begin = tempStart.getTime();
        }
        return result;
    }

    /**
     * 判断时间是否在时间段内
     *
     * @param nowTime
     * @param beginTime
     * @param endTime
     * @return
     */
    public static boolean belongCalendar(Date nowTime, Date beginTime, Date endTime) {
        //设置当前时间
        Calendar date = Calendar.getInstance();
        date.setTime(nowTime);
        //设置开始时间
        Calendar begin = Calendar.getInstance();
        begin.setTime(beginTime);
        //设置结束时间
        Calendar end = Calendar.getInstance();
        end.setTime(endTime);
        //处于开始时间之后，和结束时间之前的判断
        if (date.after(begin) && date.before(end)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 时间加小时
     *
     * @param date  时间
     * @param hours 小时
     * @return 加过小时的时间
     */
    public static Date dateAddHours(Date date, Integer hours) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        // 24小时制
        cal.add(Calendar.HOUR, hours);
        date = cal.getTime();
        return date;
    }

    /**
     * 获取前n年或者后n年的date
     *
     * @param date date
     * @param year -1 1年前的时间，+1 1年后的时间
     * @return date
     */
    public static Date getYearDifference(Date date, int year) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.YEAR, year);
        return cal.getTime();
    }

    /**
     * 判断两个时间区间是否重合
     *
     * @param beginA 区间A开始时间
     * @param endA   区间B开始时间
     * @param beginB 区间B开始时间
     * @param endB   区间B结束时间
     * @return 返回值
     */
    public static Boolean isOverlapping(LocalDateTime beginA, LocalDateTime endA, LocalDateTime beginB, LocalDateTime endB) {

        if (beginA.compareTo(endA) > 0) {
            throw new RuntimeException("区间A开始时间必须小于等于结束时间");
        }
        if (beginB.compareTo(endB) > 0) {
            throw new RuntimeException("区间B开始时间必须小于等于结束时间");
        }

        if (beginA.compareTo(beginB) >= 0 && beginA.compareTo(endB) <= 0) {
            return true;
        }

        if (endA.compareTo(beginB) >= 0 && endA.compareTo(endB) <= 0) {
            return true;
        }

        if (beginB.compareTo(beginA) >= 0 && beginB.compareTo(endA) <= 0) {
            return true;
        }

        if (endB.compareTo(beginA) >= 0 && endB.compareTo(endA) <= 0) {
            return true;
        }
        return false;
    }

    /**
     * 如果时间是数据库默认的1970年开头的时间，则返回空,否则不变
     *
     * @param date 时间
     * @return 时间
     */
    public static Date convertDefaultTimeToNull(Date date) {
        return DateUtilsExt.formatDate(date).contains(DateUtilsExt.YEAR_STRING) ? null : date;
    }


    /**
     * 默认时间返回空
     *
     * @param date 时间
     * @return 返回时间str
     */
    public static String convertTimeStrWithOutDefault(Date date, String pattern) {
        if (null == date || date.getTime() == PMS_DEFAULT_TIME.getTime()) {
            return "";
        }
        return format(date, pattern);
    }


    /**
     * 时间戳转换为时间
     *
     * @param timestamp 时间戳
     * @return 时间
     */
    public static LocalDateTime getDateTimeOfTimestamp(long timestamp) {
        Instant instant = Instant.ofEpochMilli(timestamp);
        ZoneId zone = ZoneId.systemDefault();
        return LocalDateTime.ofInstant(instant, zone);
    }

    /**
     * 判断日期是否在某个时间段内
     *
     * @param beginTimeString 开始时间
     * @param endTimeString   结束时间
     * @param targetTime      目标日期
     * @return 是否在两个时间内
     */
    public static boolean isInTimeScope(String beginTimeString, String endTimeString, LocalTime targetTime) {
        LocalTime beginTime = LocalTime.parse(beginTimeString, DateTimeFormatter.ofPattern("HH:mm:ss"));
        LocalTime endTime = LocalTime.parse(endTimeString, DateTimeFormatter.ofPattern("HH:mm:ss"));
        return targetTime.isAfter(beginTime) && targetTime.isBefore(endTime);
    }
}
