import React from 'react';
import { ReactPdfView } from "@features/fa-admin-pages/components";

/**
 * @author xu.pengfei
 * @date 2023/2/1 17:31
 */
export default function pdfView() {
  return (
    <div className="fa-full-content fa-p12">
      <ReactPdfView fileUrl="/plugins/pdfjs/test.pdf" />
    </div>
  )
}
