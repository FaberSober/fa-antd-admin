package com.faber.admin;

import org.junit.Test;

import java.util.Arrays;

public class ArrayTest {

    @Test
    public void testBinarySearch() {
        String[] ss = new String[]{"1", "2", "3"};
        System.out.println(Arrays.binarySearch(ss, "0"));
        System.out.println(Arrays.binarySearch(ss, "1"));
        System.out.println(Arrays.binarySearch(ss, "2"));
        System.out.println(Arrays.binarySearch(ss, "3"));
        System.out.println(Arrays.binarySearch(ss, "4"));
        System.out.println(Arrays.binarySearch(ss, "5"));

        System.out.println(Arrays.asList(ss).contains("0"));
        System.out.println(Arrays.asList(ss).contains("1"));
        System.out.println(Arrays.asList(ss).contains("2"));
        System.out.println(Arrays.asList(ss).contains("4"));
    }

}
