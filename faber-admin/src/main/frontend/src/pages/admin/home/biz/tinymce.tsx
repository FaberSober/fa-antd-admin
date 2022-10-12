import React from 'react';
import BaseTinyMCE from "@/components/base-editor/BaseTinyMCE";

/**
 * @author xu.pengfei
 * @date 2022/10/12
 */
export default function tinymce() {
  return (
    <div className="fa-full-content fa-padding-12">
      <BaseTinyMCE style={{ width: 800, height: 500 }} />
    </div>
  )
}
