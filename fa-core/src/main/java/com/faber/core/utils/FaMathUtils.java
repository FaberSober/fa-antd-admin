package com.faber.core.utils;

import java.util.ArrayList;
import java.util.List;

public class FaMathUtils {

    public static Double getCosineSimilarity(float[] x, float[] y) {
        List<Double> xList = new ArrayList<>();
        for (float xi : x) {
            xList.add((double) xi);
        }
        List<Double> yList = new ArrayList<>();
        for (float yi : y) {
            yList.add((double) yi);
        }
        return FaMathUtils.getCosineSimilarity(xList, yList);
    }

    public static Double getCosineSimilarity(List<Double> x, List<Double> y) {
        double numerator = 0D;
        for (int i = 0; i < x.size(); i++) {
            numerator += x.get(i) * y.get(i);
        }

        double leftDenominator = 0D;
        for (Double num : x) {
            leftDenominator += num * num;
        }

        double rightDenominator = 0D;
        for (Double num : y) {
            rightDenominator += num * num;
        }

        return numerator / (Math.sqrt(leftDenominator) * Math.sqrt(rightDenominator));
    }

}
