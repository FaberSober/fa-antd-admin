import React from 'react';
import { SITE_INFO } from '@/configs'
import { Empty } from "antd";
// import { DocumentEditor } from "@onlyoffice/document-editor-react";



/**
 * @author xu.pengfei
 * @date 2023/3/13 11:14
 */
export default function doc() {

  const onDocumentReady = (event:any) => {
    console.log("Document is loaded", event);
  };

  return (
    <div className="fa-full-content fa-flex-row fa-p12">
      <Empty />
      {/*<DocumentEditor*/}
      {/*  id="docxEditor"*/}
      {/*  documentServerUrl={SITE_INFO.ONLYOFFICE_SERVER}*/}
      {/*  config={{*/}
      {/*    "document": {*/}
      {/*      "fileType": "docx",*/}
      {/*      "key": "testdocx00001",*/}
      {/*      "title": "Example Document Title.docx",*/}
      {/*      "url": "http://file.qiniu.test.dward.cn/tmp/doc/test.docx"*/}
      {/*    },*/}
      {/*    "documentType": "word",*/}
      {/*    "editorConfig": {*/}
      {/*      "callbackUrl": "https://example.com/url-to-callback.ashx",*/}
      {/*      "lang": "zh",*/}
      {/*      "user": {*/}
      {/*        "id": "1",*/}
      {/*        "name": "王美丽",*/}
      {/*        "group": ""*/}
      {/*      }*/}
      {/*    },*/}
      {/*    // onlyoffice server使用了jwt加密，需要对config里除了token的部分加密。参考：D:\code\learn\onlyoffice\Java Spring Example\src\main\java\com\onlyoffice\integration\services\configurers\implementations\DefaultFileConfigurer.java*/}
      {/*    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkb2N1bWVudCI6eyJmaWxlVHlwZSI6ImRvY3giLCJrZXkiOiJ0ZXN0ZG9jeDAwMDAxIiwidGl0bGUiOiJFeGFtcGxlIERvY3VtZW50IFRpdGxlLmRvY3giLCJ1cmwiOiJodHRwOi8vZmlsZS5xaW5pdS50ZXN0LmR3YXJkLmNuL3RtcC9kb2MvdGVzdC5kb2N4In0sImRvY3VtZW50VHlwZSI6IndvcmQiLCJlZGl0b3JDb25maWciOnsiY2FsbGJhY2tVcmwiOiJodHRwczovL2V4YW1wbGUuY29tL3VybC10by1jYWxsYmFjay5hc2h4IiwibGFuZyI6InpoIiwidXNlciI6eyJpZCI6IjEiLCJuYW1lIjoi546L576O5Li9IiwiZ3JvdXAiOiIifX19.UTBm5TdfZIYGXE4vwuRvRePYHf9fF-3wTux4jXwrHFM",*/}
      {/*  }}*/}
      {/*  events_onDocumentReady={onDocumentReady}*/}
      {/*/>*/}
    </div>
  )
}
