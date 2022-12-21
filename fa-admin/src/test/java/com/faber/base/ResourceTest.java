package com.faber.base;

import com.faber.AdminBootstrap;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ResourceTest {

    @Test
    public void testGetJarDir() {
        ApplicationHome home = new ApplicationHome(getClass());
        File jarFile = home.getSource();
        String path = jarFile.getParentFile().toString();
        System.out.println(path);
    }

}
