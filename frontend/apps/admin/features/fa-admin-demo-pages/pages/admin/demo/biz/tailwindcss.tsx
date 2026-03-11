import React from 'react';
import { FaButton } from "@fa/ui";
import { Card } from "antd";

/**
 * @author xu.pengfei
 * @date 2023/1/6 14:20
 */
export default function tailwindcss() {
  return (
    <div className="fa-full-content-p12">
      <Card title="使用tailwindcss构建的button组件" className="fa-mb12">
        <div>
          <FaButton style={{ width: 300 }} />
        </div>
      </Card>

      <Card title="直接使用tailwindcss的样式" className="fa-mb12">
        <div>
          <div style={{ width: 300 }}>
            <div className="rounded-md">
              <a target="_blank" href="https://turbo.build/repo/docs" rel="noreferrer">
                <div className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white no-underline bg-black border border-transparent rounded-md hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-300 md:py-3 md:px-10 md:text-lg md:leading-6">
                  Read the docs
                  <span className="ml-2 text-transparent bg-gradient-to-r from-brandred to-brandblue bg-clip-text">→</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
