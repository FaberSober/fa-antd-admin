import React from 'react';
import type { App } from "@features/fa-app-pages/types";
import { Descriptions } from "antd";


export interface ApkCrashViewProps {
  apkCrash: App.ApkCrash
}

/**
 * @author xu.pengfei
 * @date 2023/1/20 15:59
 */
export default function ApkCrashView({apkCrash}: ApkCrashViewProps) {
  return (
    <Descriptions bordered column={1} labelStyle={{ width: 120 }}>
      <Descriptions.Item label="应用ID">{apkCrash.appId}</Descriptions.Item>
      <Descriptions.Item label="应用名称">{apkCrash.name}</Descriptions.Item>
      <Descriptions.Item label="应用包名">{apkCrash.applicationId}</Descriptions.Item>
      <Descriptions.Item label="版本号">{apkCrash.versionCode}</Descriptions.Item>
      <Descriptions.Item label="版本名称">{apkCrash.versionName}</Descriptions.Item>
      <Descriptions.Item label="错误日志">{apkCrash.message}</Descriptions.Item>
      <Descriptions.Item label="崩溃日志详情" contentStyle={{whiteSpace: 'break-spaces'}}>{apkCrash.detail}</Descriptions.Item>
      <Descriptions.Item label="崩溃时间">{apkCrash.crashTime}</Descriptions.Item>
      <Descriptions.Item label="rom信息">{apkCrash.romInfo}</Descriptions.Item>
      <Descriptions.Item label="设备厂商">{apkCrash.deviceManufacturer}</Descriptions.Item>
      <Descriptions.Item label="设备型号">{apkCrash.deviceModel}</Descriptions.Item>
      <Descriptions.Item label="android版本">{apkCrash.androidVersion}</Descriptions.Item>
      <Descriptions.Item label="sdk版本">{apkCrash.androidSdk}</Descriptions.Item>
    </Descriptions>
  )
}