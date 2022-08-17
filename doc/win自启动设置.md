# 方式一-自己编写命令
## 1. 在jar包目录新建一个start.bat 文件，然后写入启动命令
```cmd
@echo off
TIMEOUT /T 40
java -jar C:\Users\xpf\Documents\xxx\xxx.jar
pause
```

## 2. 仍然在此目录，新建start.vbs 文件，然后写入一下命令，命令最后一个0是隐藏窗口运行
```
createobject("wscript.shell").run"D:\start.bat",0
```

## 3. 创建run.vbs的快捷方式，移动到开机自启动目录下：
```
C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup
```

> 参考文档：https://blog.csdn.net/weixin_46724181/article/details/122598733

# 利用服务

## 1. 复制exe文件
1. 复制`WinSW.NET4.exe`、`sample-minimal.xml`文件到jar相同目录
2. 修改exe、xml文件与jar相同名称，如：
    - xxx.exe
    - xxx.jar
    - xxx.xml

## 2. 修改xml配置文件如下
```xml
<service>
  <!-- ID of the service. It should be unique accross the Windows system-->
    <!--服务ID：启动、关闭、删除服务时，都是通过ID来操作的-->
  <id>xxx</id>
  <!-- Display name of the service -->
  <name>xxx</name>
  <!-- Service description -->
  <description>fileservice</description>
  
  <!-- Path to the executable, which should be started -->
    <!--当前电脑配置了java环境变量，直接写成“java”就行；你也可以写成类似这样：D:\develop\jdk1.8\jre\bin\java-->
  <executable>java</executable>
    <!--<arguments>-jar "C:\Users\Administrator\Desktop\winsw\statement-0.0.1-SNAPSHOT.jar"</arguments>-->
  <arguments>-jar C:\Users\xpf\Documents\xxx\xxx.jar -Xms512M -Xmx512M</arguments>
 
  <!--
    OPTION: onfailure
    Defines a sequence of actions, which should be performed if the managed executable fails.
    Supported actions: restart, reboot, none
  -->
  <onfailure action="restart" delay="10 sec"/>
  <onfailure action="restart" delay="20 sec"/>
  <!--
    OPTION: resetfailure
    Time, after which the Windows service resets the failure status.
    Default value: 1 day
  -->
  <resetfailure>1 hour</resetfailure>
  <!--
    OPTION: priority
    Desired process priority.
    Possible values: Normal, Idle, High, RealTime, BelowNormal, AboveNormal
    Default value: Normal
  -->
  <priority>Normal</priority>
  
  <!-- 
    OPTION: stoptimeout
    Time to wait for the service to gracefully shutdown the executable before we forcibly kill it
    Default value: 15 seconds
  -->
  <stoptimeout>15 sec</stoptimeout>
    
  <!--
    OPTION: stopparentprocessfirst
    If set, WinSW will terminate the parent process before stopping the children.
    Default value: false
  -->
  <stopparentprocessfirst>false</stopparentprocessfirst>
 
    <!--
      OPTION: startmode
      Defines start mode of the service.
      Supported modes: Automatic, Manual, Boot, System (latter ones are supported for driver services only)
      Default mode: Automatic
    -->
    <startmode>Automatic</startmode>
    <waithint>15 sec</waithint>
    <sleeptime>1 sec</sleeptime>
    <log mode="roll-by-size">
        <sizeThreshold>10240</sizeThreshold>
        <keepFiles>8</keepFiles>
    </log>
</service>
```

## 3. install 安装服务
1. cmd命令行，输入 xxx.exe install 安装服务
   如果权限不足，需要进入c:\windows\System32 目录下，用管理员权限运行cmd
   
## 4. 启动服务
1. net start xxx 启动服务
2. net stop xxx 关闭服务
3. sc delete xxx 删除服务

编写脚本：start_service_auto.bat
```
@echo off
TIMEOUT /T 40
net start xxx
```

## 5. 设置自启动
1. 将`start_service_auto.bat`拖动到自启动文件夹。
```
C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup
```


> 参考文档：https://blog.csdn.net/qq3434569/article/details/102970341

