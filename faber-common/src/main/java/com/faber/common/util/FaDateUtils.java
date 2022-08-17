package com.faber.common.util;

import java.util.Calendar;
import java.util.Date;

public class FaDateUtils {

    public static Integer getYear(Date date) {
        if (date == null) return null;
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.YEAR);
    }

}
