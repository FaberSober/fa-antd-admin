import React, {CSSProperties, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {useSize} from "ahooks";
import {trim} from 'lodash';
import fileSaveApi from '@/services/admin/fileSave'
import useHeight from "@/utils/hooks/useHeight";


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
  const height = useHeight(divRef);
  const [innerValue, setInnerValue] = useState(value)

  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (editorRef.current) {
        return editorRef.current.getContent()
      }
      return '';
    },
    setContent: (html: string) => {
      if (editorRef.current) {
        // console.log('setContent', html, editorRef.current)
        editorRef.current.setContent(trim(html));
      }
    },
  }));

  useEffect(() => {
    if (value !== innerValue) {
      if (editorRef.current) {
        console.log('update innerValue from props.value = ', value)
        setInnerValue(value)
        editorRef.current.setContent(trim(value));
      }
    }
  }, [value])

  const editor = useMemo(() => {
    console.log('useMemo.editor', height)
    if (height === undefined) return null;
    return (<Editor
        apiKey='xxx'
        style={{ margin: -10, padding: 10 }}
        tinymceScriptSrc="/plugins/tinymce/v6.2.0/tinymce.min.js"
        onInit={(evt, editor) => {
          // console.log('BaseTinyMCE#onInit')
          editorRef.current = editor;
        }}
        initialValue={value}
        init={{
          height,
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
          // images_upload_url: SITE_INFO.TINYMCE_FILE_UPLOAD_API,
          images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());
            fileSaveApi.uploadFileForm(formData, (pe) => progress(pe.loaded / pe.total * 100)).then(res => {
              resolve(res.data.localUrl);
            })
          }),
          /* enable title field in the Image dialog*/
          image_title: true,
          /* enable automatic uploads of images represented by blob or data URIs*/
          automatic_uploads: true,
          /*
            URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
            images_upload_url: 'postAcceptor.php',
            here we add custom filepicker only to Image dialog
          */
          file_picker_types: 'image',
          relative_urls: false,
          /* and here's our custom image picker*/
          file_picker_callback: (cb, value, meta) => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.addEventListener('change', (e) => {
              // @ts-ignore
              const file = e.target.files[0];

              const reader = new FileReader();
              reader.addEventListener('load', () => {
                // 走自己服务器上传，节省自己服务器带宽
                fileSaveApi.uploadFile(file).then(res => {
                  cb(res.data.localUrl, { title: file.name });
                })

                // 走七牛云服务器上传，节省自己服务器带宽
                // fetchUploadImgQiniu(
                //   file,
                //   'editor/image',
                //   file.name,
                //   (path, res) => {
                //     /* call the callback and populate the Title field with the file name */
                //     cb(path, { title: file.name });
                //   },
                //   (res) => {
                //     const { percent } = res.total;
                //   },
                //   (res) => {
                //     // onError(new Error(res), file);
                //   }
                // );
              });
              reader.readAsDataURL(file);
            });

            input.click();
          },
          ...editorInit,
        }}
        // onBeforeSetContent={(e) => console.log('onBeforeSetContent', e)}
        // onNodeChange={(e) => console.log('onNodeChange', e)}
        // onSelectionChange={(e) => console.log('onSelectionChange', e)}
        onFocus={(e) => {
          // console.log('onFocus', editorRef.current.getContent())
        }}
        onBlur={(e) => {
          // console.log('onBlur', e, editorRef.current.getContent())
          if (onChange) {
            onChange(editorRef.current.getContent())
          }
        }}
        onChange={(e) => {
          // console.log('onChange', e, editorRef.current.getContent())
          setInnerValue(editorRef.current.getContent())
          if (onChange) {
            onChange(editorRef.current.getContent())
          }
        }}
        {...editorProps}
      />
    )
  }, [height])

  return (
    <div ref={divRef} style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
      {editor}
    </div>
  )
}

export default React.forwardRef(BaseTinyMCE);
