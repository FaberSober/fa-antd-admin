import React from 'react';
import { Button } from "@fa/ui";
import { Card } from "antd";

/**
 * @author xu.pengfei
 * @date 2023/1/6 14:20
 */
export default function tailwindcss() {
  return (
    <div className="fa-full-content fa-bg-white fa-p12">
      <Card title="使用tailwindcss构建的button组件" className="fa-mb12">
        <div>
          <Button style={{ width: 300 }} />
        </div>
      </Card>

      <Card title="直接使用tailwindcss的样式" className="fa-mb12">
        <div>
          <div style={{ width: 300 }}>
            <div className="rounded-md">
              <a target="_blank" href="https://turbo.build/repo/docs" rel="noreferrer">
                <div className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white no-underline hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-300 md:py-3 md:px-10 md:text-lg md:leading-6">
                  Read the docs
                  <span className="ml-2 bg-gradient-to-r from-brandred to-brandblue bg-clip-text text-transparent">→</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}