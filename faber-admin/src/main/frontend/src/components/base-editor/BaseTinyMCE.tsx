import React, {CSSProperties, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {useSize} from "ahooks";
import { trim } from 'lodash';
import {v4 as uuidv4} from 'uuid';


export interface BaseHtmlNEditorProps {
  value?: string | undefined;
  onChange?: (v: string) => void;
  style?: CSSProperties;
  editorInit?: any,
  editorProps?: any,
}

/**
 * TinyMCE编辑器
 * @author xu.pengfei
 * @date 2022/2/17 14:17
 */
function BaseTinyMCE({ value, onChange, style, editorInit, editorProps }: BaseHtmlNEditorProps, ref: any) {
  const editorRef = useRef<any>(null);

  const divRef = useRef<any | null>();
  const size = useSize(divRef);

  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (editorRef.current) {
        return editorRef.current.getContent()
      }
      return '';
    },
    setContent: (html: string) => {
      if (editorRef.current) {
        console.log('setContent', html, editorRef.current)
        editorRef.current.setContent(trim(html));
      }
    },
  }));

  useEffect(() => {
    if (value === undefined) return;
    // console.log('BaseTinyMCE#useEffect', value);
    if (editorRef.current) {
      editorRef.current.setContent(trim(value));
    }
  }, [value]);

  console.log('size', size)
  return (
    <div ref={divRef} style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
      {size && size.height && (
        <Editor
          apiKey='xxx'
          style={{ margin: -10, padding: 10 }}
          tinymceScriptSrc="/plugins/tinymce/v6.2.0/tinymce.min.js"
          onInit={(evt, editor) => {
            editorRef.current = editor;
          }}
          initialValue={value}
          init={{
            height: size.height,
            menubar: false,
            language: 'zh-Hans',
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
              'emoticons'
            ],
            toolbar: 'blocks bold italic forecolor bullist numlist table link image charmap emoticons fullscreen help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            /**
             * 需要在后台提供对应API的接口，参考：https://www.tiny.cloud/docs/advanced/php-upload-handler/
             * 返回数据json格式为：{ location : '/your/uploaded/image/file'}
             */
            images_upload_url: '/api/v1/base/file/uploadTinyMCEFile',
            ...editorInit,
          }}
          // onBeforeSetContent={(e) => console.log('onBeforeSetContent', e)}
          // onNodeChange={(e) => console.log('onNodeChange', e)}
          // onSelectionChange={(e) => console.log('onSelectionChange', e)}
          onFocus={(e) => {
            console.log('onFocus', editorRef.current.getContent())
          }}
          onBlur={(e) => {
            console.log('onBlur', e, editorRef.current.getContent())
            if (onChange) {
              onChange(editorRef.current.getContent())
            }
          }}
          onChange={(e) => {
            console.log('onChange', e, editorRef.current.getContent())
            if (onChange) {
              onChange(editorRef.current.getContent())
            }
          }}
          {...editorProps}
        />
      )}
    </div>
  )
}

export default React.forwardRef(BaseTinyMCE);
