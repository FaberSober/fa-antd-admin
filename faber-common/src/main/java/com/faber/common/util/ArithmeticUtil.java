package com.faber.common.util;

import java.math.BigDecimal;
import java.text.DecimalFormat;

public class ArithmeticUtil {
    /**
     * 数字格式化 保留两位小数 四舍五入
     */
    public static DecimalFormat format = new DecimalFormat("0.00");

    /**
     * 精确计算加法
     *
     * @param a 加数
     * @param b 被加数
     * @return 和
     */
    public static double add(double a, double b) {
        BigDecimal bigDecimalA = new BigDecimal(Double.toString(a));
        BigDecimal bigDecimalB = new BigDecimal(Double.toString(b));
        return Double.parseDouble(format.format(bigDecimalA.add(bigDecimalB)));
    }

    /**
     * 精确计算加法
     *
     * @param a 加数
     * @param b 被加数
     * @return 和
     */
    public static double add(BigDecimal a, double b) {
        if (a == null) {
            a = BigDecimal.ZERO;
        }
        BigDecimal bigDecimalB = new BigDecimal(b);
        return Double.parseDouble(format.format(a.add(bigDecimalB)));
    }

    /**
     * 精确计算加法
     *
     * @param a 加数
     * @param b 被加数
     * @return 和
     */
    public static BigDecimal addBigDecimal(BigDecimal a, double b) {
        if (a == null) {
            a = BigDecimal.ZERO;
        }
        BigDecimal bigDecimalB = new BigDecimal(Double.toString(b));
        return a.add(bigDecimalB);
    }

    /**
     * 精确计算加法
     *
     * @param a 加数
     * @param b 被加数
     * @return 和
     * @see [类、类#方法、类#成员]
     */
    public static BigDecimal add(BigDecimal a, BigDecimal b) {
        if (a == null) {
            a = BigDecimal.ZERO;
        }
        return a.add(b);
    }

    /**
     * 减法运算
     *
     * @param a 被减数
     * @param b 减数
     * @return 差
     */
    public static double sub(double a, double b) {
        BigDecimal bigDecimalA = new BigDecimal(Double.toString(a));
        BigDecimal bigDecimalB = new BigDecimal(Double.toString(b));
        return Double.parseDouble(format.format(bigDecimalA.subtract(bigDecimalB)));
    }

    /**
     * 减法运算
     *
     * @param bigDecimalA 被减数
     * @param bigDecimalB 减数
     * @return 差
     */
    public static BigDecimal subBigDecimal(BigDecimal bigDecimalA, BigDecimal bigDecimalB) {
        if (bigDecimalA == null) {
            bigDecimalA = BigDecimal.ZERO;
        }
        if (bigDecimalB == null) {
            bigDecimalB = BigDecimal.ZERO;
        }
        return bigDecimalA.subtract(bigDecimalB);
    }

    /**
     * 乘法运算
     *
     * @param a 乘数
     * @param b 被乘数
     * @return 乘积
     */
    public static double multiplication(double a, double b) {
        BigDecimal bigDecimalA = new BigDecimal(Double.toString(a));
        BigDecimal bigDecimalB = new BigDecimal(Double.toString(b));
        return Double.parseDouble(format.format(bigDecimalA.multiply(bigDecimalB)));
    }

    /**
     * 乘法运算
     *
     * @param bigDecimalA 乘数
     * @param bigDecimalB 被乘数
     * @return 乘积
     */
    public static double multiplication(BigDecimal bigDecimalA, BigDecimal bigDecimalB) {
        if (bigDecimalA == null) {
            bigDecimalA = BigDecimal.ZERO;
        }
        if (bigDecimalB == null) {
            bigDecimalB = BigDecimal.ZERO;
        }
        return Double.parseDouble(format.format(bigDecimalA.multiply(bigDecimalB)));
    }

    /**
     * 乘法运算
     *
     * @param bigDecimalA 乘数
     * @param bigDecimalB 被乘数
     * @return 乘积
     */
    public static BigDecimal multiBigDecimal(BigDecimal bigDecimalA, BigDecimal bigDecimalB) {
        if (bigDecimalA == null) {
            bigDecimalA = BigDecimal.ZERO;
        }
        if (bigDecimalB == null) {
            bigDecimalB = BigDecimal.ZERO;
        }
        return bigDecimalA.multiply(bigDecimalB);
    }


    /**
     * 除法
     *
     * @param a 被除数
     * @param b 除数
     * @return 商
     */
    public static double divide(Double a, Double b) {
        BigDecimal aBigDecimal = new BigDecimal(a);
        BigDecimal bBigDecimal = new BigDecimal(b);
        return aBigDecimal.divide(bBigDecimal, 2, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 增值税计算
     *
     * @return double
     */
    public static double calcTax(Double amount, Double rate) {
        BigDecimal amountBigDecimal = new BigDecimal(amount);
        BigDecimal rateBigDecimal = new BigDecimal(rate);
        BigDecimal onePlusRate = new BigDecimal(add(1.0, rateBigDecimal.doubleValue()));
        return amountBigDecimal.multiply(rateBigDecimal).divide(onePlusRate, 2, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    public static BigDecimal divide(BigDecimal a, BigDecimal b) {
        return a.divide(b, 2, BigDecimal.ROUND_HALF_UP);
    }

    public static BigDecimal divideScale(BigDecimal a, BigDecimal b, int scale) {
        return a.divide(b, scale, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * 四舍五入保留二位小数
     *
     * @param amount BigDecimal
     * @return BigDecimal
     */
    public static BigDecimal halfUp(BigDecimal amount) {
        if (null == amount) {
            return BigDecimal.ZERO;
        }
        return amount.setScale(2, BigDecimal.ROUND_HALF_UP);
    }


    /**
     * 有条件的出发
     *
     * @param a            被除数
     * @param b            除数
     * @param scale        保留的小数位数
     * @param roundingMode 保留小数后面的处理
     * @return BigDecimal
     */
    public static BigDecimal devideWithOption(BigDecimal a, BigDecimal b, int scale, int roundingMode) {
        return a.divide(b, scale, roundingMode);
    }

    /**
     * 获取默认值
     *
     * @param a
     * @return
     */
    public static BigDecimal getDefaultValue(BigDecimal a) {
        return null == a ? BigDecimal.ZERO : a;
    }
}
